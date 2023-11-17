import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaPromise, StatusModo } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChatGateway } from './chat.gateway';
import * as bcrypt from 'bcrypt';
import { NewMessageDto } from './dto/new-message.dto';
import { use } from 'passport';
import { get } from 'http';
import { editChannelDto } from './dto/editchannel.dto';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService, private gateway: ChatGateway) { }

	saltOrRounds = 10;

	async findAllChannels(): Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			select: {
				id: true,
				name: true,
				privacy: true,
			}
		});
		return channels;
	}

	async findAllJoinedChannels(userId: number): Promise<PrismaPromise<any>> {
		const userChannelMaps = await this.prisma.userChannelMap.findMany({
			where: {
				userId: userId,
				status: {
					not: "BANNED"
				}
			},
			select: {
				channel: {
					select: {
						id: true,
						name: true,
						privacy: true,
					}
				}
			},
		});

		const channels = userChannelMaps.map(userChannelMap => userChannelMap.channel);
		channels.forEach(channel => channel["joined"] = true);
		return channels;
	}

	async getChannelById(channelId: number): Promise<PrismaPromise<any>> {
		const channel = await this.prisma.channels.findUnique({
			where: {
				id: channelId,
			}
		});
		if (!channel) {
			Logger.log("Channel not found", channelId);
			throw new NotFoundException("Channel not found");
		}
		return channel;
	}

	// returns all channels that match the search term and a boolean indicating if the user is in the channel
	async findChannelBySearch(searchTerm: string, userId: number): Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				},
				// exclude private channels
				privacy: {
					not: "PRIVATE"
				}
			},
			select: {
				id: true,
				name: true,
				privacy: true,
				users: {
					select: {
						userId: true,
						status: true,
					}
				}
			}
		});
		const ret = channels.map(channel => {
			return {
				id: channel.id,
				name: channel.name,
				privacy: channel.privacy,
				joined: channel.users.some(user => user.userId === userId && user.status !== "BANNED"),
			}
		});
		return ret;
	}

	async createChannelIfNotExists(newChannel: CreateChannelDto, userId: number): Promise<PrismaPromise<any>> {
		newChannel.name = newChannel.name.toLowerCase();
		let hashedPassword = null;
		if (newChannel.privacy === "PASSWORD_PROTECTED") {
			hashedPassword = await bcrypt.hash(newChannel.password, this.saltOrRounds);
		}
		const channel = await this.prisma.$transaction(async (tx) => {
			const existingChannel = await tx.channels.findUnique({
				where: {
					name: newChannel.name,
				}
			});
			if (existingChannel) {
				Logger.log("Channel already exists", "ChatService");
				existingChannel["message"] = "This channel already exists";
				return existingChannel;
			}
			const channel = await tx.channels.create({
				data: {
					name: newChannel.name,
					privacy: newChannel.privacy,
					ownerId: userId,
					// add password if privacy is PASSWORD_PROTECTED
					...(newChannel.privacy === "PASSWORD_PROTECTED" && { password: hashedPassword }),
				}
			});
			return channel;
		});
		if (channel["message"])
			return channel;
		Logger.log(`Channel [${channel.name}] created`, "ChatService");
		await this.joinChannel(channel.id, userId, newChannel.password);
		if (channel.privacy != "PRIVATE")
			this.setUserStatus(channel.id, userId, "OWNER")
		return channel;
	}

	async joinChannel(channelId: number, userId: number, password?: string) {
		if (channelId < 1 || Number.isNaN(channelId))
			throw new BadRequestException(`Invalid channel id (${channelId})`);

		if (await this.isUserInChannel(channelId, userId)) {
			Logger.log(`User [${userId}] already in channel [${channelId}]`, "ChatService");
			return { message: "User already in channel" };
		}

		if (await this.isUserInChannelBanned(channelId, userId)) {
			Logger.log(`User [${userId}] banned in channel [${channelId}]`, "ChatService");
			return { message: "User banned in channel" };
		}

		const channel = await this.prisma.channels.findUnique({
			where: {
				id: channelId,
			},
		});
		if (channel.privacy === "PASSWORD_PROTECTED") {
			if (!password) {
				Logger.log(`Password required for channel [${channelId}]`, "ChatService");
				return { message: "Password required" };
			}
			const hashedPassword: string = channel["password"];
			const passIsOk = await bcrypt.compare(password, hashedPassword);
			if (!passIsOk) {
				Logger.log(`Invalid password for channel [${channelId}]`, "ChatService");
				return { message: "Invalid password", };
			}
		}

		const ret = await this.prisma.userChannelMap.create({
			data: {
				channelId: channelId,
				userId: userId,
			}
		});
		Logger.log(`User [${userId}] joined channel [${channelId}]`, "ChatService");
		return ret;
	}

	async leaveChannel(channelId: number, userId: number) {
		if (channelId < 1 || Number.isNaN(channelId))
			throw new BadRequestException(`Invalid channel id (${channelId})`);
		try {
			const ret = await this.prisma.userChannelMap.delete({
				where: {
					id: { channelId: channelId, userId: userId },
					channel: {
						privacy: {
							not: "PRIVATE"
						}
					}
				}
			});
			Logger.log(`User [${userId}] left channel [${channelId}]`, "ChatService");
			return ret;
		}
		catch (e) {
			Logger.log(`No entry found for user [${userId}] in channel [${channelId}]`, "ChatService");
			throw new NotFoundException(`No entry found for user [${userId}] in channel [${channelId}]`);
		}
	}

	async addNewMessage(channelId: number, newMessage: NewMessageDto, userId: number) {

		if (/[^\s]+/.test(newMessage.msg)) {
			try {
				const user = await this.prisma.userChannelMap.findUnique({
					where: {
						id: { channelId: channelId, userId: userId },
						status: {
							not: "BANNED"
						}
					},
					select: {
						mutedUntil: true
					}
				})
				if (!user || user.mutedUntil >= new Date(Date.now())) {
					return { message: "You are muted for " + Math.trunc(((Number(user.mutedUntil) - Date.now()) / 1000)) + " seconds" }
				}
				const ret = await this.prisma.messages.create({
					data: {
						content: newMessage.msg.trim(),
						senderId: userId,
						channelId: channelId,
						type: "MESSAGE"
					}
				})
			}
			catch (e) {
				Logger.log("Can't add msg");
				return { message: "Can't add msg" }
			}
		}
		return false
	}

	async getChannelMessages(channelId: number, userId: number) {
		try {
			if (await this.isUserInChannel(channelId, userId) == false) {
				return { message: "You are not in this channel" }
			}
			const blockedId = await this.prisma.relationships.findMany({
				where: {
					userId: userId,
					status: "BLOCKED"
				},
				select: {
					targetId: true
				}
			})
			const tableauDeNombres = blockedId.map(objet => objet.targetId);
			const messages = await this.prisma.messages.findMany({
				where: {
					channelId: channelId,
					senderId: { notIn: tableauDeNombres },
				},
				select: {
					id: true,
					sender: {
						select: {
							name: true,
							id: true,
						}
					},
					content: true,
					createdAt: true,
					type: true,
				}
			})
			return messages
		}
		catch (e) {
			Logger.log("Can't get messages", "ChatService");
			console.log(e)
			return { message: "Can't get messages", "error": e }
		}
	}

	async isUserInChannel(channelId: number, userId: number): Promise<boolean> {
		const userChannelMap = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId },
				status: {
					not: "BANNED"
				}
			}
		});
		return !!userChannelMap;
	}

	async isUserInChannelBanned(channelId: number, userId: number): Promise<boolean> {
		const userChannelMap = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId },
				status: "BANNED"
			}
		});
		return !!userChannelMap;
	}

	async getNamePrivateChannel(targetId: number, userId: number) {
		let channel = await this.prisma.channels.findFirst({
			where: {
				id: targetId
			},
			select: {
				users: true
			}
		})
		if (!channel)
			throw new NotFoundException()
		if (channel.users[0].userId == userId) {
			let user = await this.prisma.user.findFirst({
				where: {
					id: channel.users[1].userId
				}
			})
			return { name: user.name }
		}
		else {
			let user = await this.prisma.user.findFirst({
				where: {
					id: channel.users[0].userId
				}
			})
			return { name: user.name }
		}
	}

	async createPrivateChannel(targetId: number, userId: number) {
		if (targetId === userId) {
			return { "message": "pas de mp avec toi meme" }
		}
		let channel = await this.prisma.channels.findFirst({
			where: {
				privacy: "PRIVATE",
				users: {
					every: {
						OR: [
							{ userId: targetId },
							{ userId: userId }
						]
					}
				}
			},
			select: {
				id: true,
				name: true,
				privacy: true,
			}
		});
		if (channel) {
			return channel;
		}
		else {
			while (!channel || channel["message"]) {
				const channelName = `priv_${userId}_${targetId}_` + Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
				channel = await this.createChannelIfNotExists({ name: channelName, privacy: "PRIVATE" }, userId);
				if (channel["message"]) {
					console.log(channel["message"]);
				}
				else {
					console.log("channel created");
					console.log(channel);
				}
			}
			await this.joinChannel(channel.id, targetId);
			return channel;
		}
	}

	async getUserIdbyNmaeInchannel(channelId: number, userName: string) {
		const user = await this.prisma.userChannelMap.findFirst({
			where: {
				channelId: channelId,
				user: {
					name: userName,
				}
			}
		});
		return user;
	}

	async gamePrivateChannel(targetId: number, userId: number, channelId: number) {
		const ret = await this.prisma.messages.create({
			data: {
				content: "Do you want to play ?",
				senderId: userId,
				channelId: channelId,
				type: "GAME"
			}
		})
		return ret
	}

	async refuseinv(messId: number) {
		await this.prisma.messages.update({
			where: {
				id: +messId,
				type: "GAME"
			},
			data: {
				type: "MESSAGE",
				content: "[INVITE TO PLAY] - DECLINED"
			}
		})
	}

	async accepterinv(messId: number) {
		await this.prisma.messages.update({
			where: {
				id: +messId,
				type: "GAME"
			},
			data: {
				type: "MESSAGE",
				content: "[INVITE TO PLAY] - ACCEPTED"
			}
		})
	}

	/*************** Moderation ***************/

	// check if user can use moderation commands on target

	async getChannelUserByName(channelId: number, name: string) {
		return await this.prisma.userChannelMap.findFirst({
			where: {
				channelId: channelId,
				user: {
					name: name,
				}
			}

		});
	}

	async getUserStatus(channelId: number, userId: number) {
		const userStatus = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId }
			},
			select: {
				status: true
			}
		})
		return userStatus
	}

	async setUserStatus(channelId: number, targetId: number, status: StatusModo) {
		return await this.prisma.userChannelMap.update({
			where: {
				id: { channelId: channelId, userId: targetId }
			},
			data: {
				status: status
			}
		})
	}

	async checkPerm(channelId: number, targetId: number, userId: number) {
		const userStatus = await this.getUserStatus(channelId, userId)
		if (!userStatus) {
			throw new NotFoundException("User not found in this channel")
		}
		const targetStatus = await this.getUserStatus(channelId, targetId)
		if (!targetStatus) {
			throw new NotFoundException("User not found in this channel")
		}
		if (userStatus.status === "OWNER" && targetStatus.status !== "OWNER" && userId !== targetId) {
			return true
		}
		if (userStatus.status === "ADMIN" && targetStatus.status !== "OWNER" && targetStatus.status !== "ADMIN" && userId !== targetId) {
			return true
		}
		return false
	}

	async muteUser(channelId: number, targetName: string, time: number, userId: number) {
		if (time < 0 || time > 86400)
			return { message: "Time must be in range [0-86400] seconds" }
		const targetUser = await this.getChannelUserByName(channelId, targetName)
		if (!targetUser) {
			return { message: "User not found in this channel" }
		}

		if (await this.checkPerm(channelId, targetUser.userId, userId)) {
			return await this.prisma.userChannelMap.update({
				where: {
					id: { channelId: channelId, userId: targetUser.userId }
				},
				data: {
					mutedUntil: new Date(Date.now() + time * 1000),
				}
			});
		}
		else {
			return { message: "You can't mute this user" }
		}
	}

	async setAdmin(channelId: number, targetName: string, userId: number) {


		if (/[^\s]+/.test(targetName)) {
			const userStatus = await this.getUserStatus(channelId, userId)
			if (!userStatus) {
				throw new NotFoundException("User not found in this channel")
			}
			if (userStatus.status !== "OWNER") {
				return { message: "You must be the owner of the channel to promote someone as admin" }
			}
			const targetUser = await this.getChannelUserByName(channelId, targetName)
			if (!targetUser) {
				return { message: "User not found in this channel" }
			}
			if (targetUser.status === "ADMIN") {
				return { message: targetName + " is already admin" }
			}
			if (targetUser.userId === userId) {
				return { message: "As Owner, you already have all admin rights" }
			}
			return await this.setUserStatus(channelId, targetUser.userId, "ADMIN")
		}
		else
			return { message: "Blank username" }
	}

	async unsetAdmin(channelId: number, targetName: string, userId: number) {
		if (/[^\s]+/.test(targetName)) {
			const userStatus = await this.getUserStatus(channelId, userId)
			if (!userStatus) {
				throw new NotFoundException("User not found in this channel")
			}
			if (userStatus.status !== "OWNER") {
				return { message: "You must be the owner of the channel to demote someone" }
			}
			const targetUser = await this.getChannelUserByName(channelId, targetName)
			if (!targetUser) {
				return { message: "User not found in this channel" }
			}
			if (targetUser.userId === userId) {
				return { message: "You can't demote yourself !" }
			}
			if (targetUser.status !== "ADMIN") {
				return { message: targetName + " is not admin" }
			}
			return await this.setUserStatus(channelId, targetUser.userId, "MEMBER")
		}
		else
			return { message: "Blank username" }
	}


	async editChannel(channelId: number, userId: number, dto: editChannelDto) {
		const status = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId }
			},
		})
		if (!status)
			throw new NotFoundException();
		const channel = await this.prisma.channels.findUnique({
			where: {
				id: channelId
			}
		})
		if (!channel)
			throw new NotFoundException();
		if (status.status != "OWNER") {
			return { message: "You are not the owner of the channel" };
		}
		if (channel.privacy === "PUBLIC" && dto.privacy === "PUBLIC")
			return { message: "There is already no password." };
		let hashedPassword = null;
		if (dto.privacy === "PASSWORD_PROTECTED") {
			hashedPassword = await bcrypt.hash(dto.password, this.saltOrRounds);
		}
		return await this.prisma.channels.update({
			where: {
				id: channelId
			},
			data: {
				privacy: dto.privacy,
				...(dto.privacy === "PASSWORD_PROTECTED" && { password: hashedPassword }),
			}
		})
	}

	async kick(channelId: number, userId: number, targetId: number) {
		if (!this.isUserInChannel(channelId, userId) || !this.isUserInChannel(channelId, targetId)) {
			return { message: "User not found in this channel" }
		}
		if (await this.checkPerm(channelId, targetId, userId)) {
			this.leaveChannel(channelId, targetId);
		}
		else
			return { "message": "You can't kick this user" }
	}

	async ban(channelId: number, userId: number, targetId: number) {
		if (await this.checkPerm(channelId, targetId, userId)) {
			if (channelId < 1 || Number.isNaN(channelId))
				throw new BadRequestException(`Invalid channel id (${channelId})`);
			try {
				const ret = await this.prisma.userChannelMap.update({
					where: {
						id: { channelId: channelId, userId: targetId },
						status: {
							not: "BANNED"
						},
						channel: {
							privacy: {
								not: "PRIVATE"
							}
						}
					},
					data: {
						status: "BANNED"
					}
				});
				console.log("ret ", ret)
				Logger.log(`User [${targetId}] banned channel [${channelId}]`, "ChatService");
				return {};
			}
			catch (e) {
				Logger.log(`No entry found for user [${targetId}] in channel [${channelId}]`, "ChatService");
				return { "message": "No entry found for user" + targetId + " in channel " + channelId };
			}
		}
		else
			return { "message": "Checkperm fail" }
	}

	async unban(channelId: number, userId: number, targetId: number) {
		if (await this.checkPerm(channelId, targetId, userId)) {
			if (channelId < 1 || Number.isNaN(channelId))
				throw new BadRequestException(`Invalid channel id (${channelId})`);
			try {
				const ret = await this.prisma.userChannelMap.delete({
					where: {
						id: { channelId: channelId, userId: targetId },
						status: "BANNED",
						channel: {
							privacy: {
								not: "PRIVATE"
							}
						}
					}
				});
				Logger.log(`User [${targetId}] unbanned channel [${channelId}]`, "ChatService");
				return {}
			}
			catch (e) {
				Logger.log(`No entry found for user [${targetId}] in channel [${channelId}]`, "ChatService");
				return { "message": "No entry found for user" + targetId + " in channel " + channelId };
			}
		}
		else
			return { "message": "Checkperm fail" }
	}
}
