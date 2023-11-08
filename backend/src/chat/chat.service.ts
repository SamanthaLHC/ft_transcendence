import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChatGateway } from './chat.gateway';
import * as bcrypt from 'bcrypt';
import { NewMessageDto } from './dto/new-message.dto';

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
					}
				}
			}
		});
		const ret = channels.map(channel => {
			return {
				id: channel.id,
				name: channel.name,
				privacy: channel.privacy,
				joined: channel.users.some(user => user.userId === userId),
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
		return channel;
	}

	async joinChannel(channelId: number, userId: number, password?: string) {
		if (channelId < 1 || Number.isNaN(channelId))
			throw new BadRequestException(`Invalid channel id (${channelId})`);

		if (await this.isUserInChannel(channelId, userId)) {
			Logger.log(`User [${userId}] already in channel [${channelId}]`, "ChatService");
			return { message: "User already in channel" };
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
					id: { channelId: channelId, userId: userId }
				}
			});
			Logger.log(`User [${userId}] left channel [${channelId}]`, "ChatService");
		}
		catch (e) {
			Logger.log(`No entry found for user [${userId}] in channel [${channelId}]`, "ChatService");
			throw new NotFoundException(`No entry found for user [${userId}] in channel [${channelId}]`);
		}
	}

	async addNewMessage(channelId: number, newMessage: NewMessageDto, userId: number) {
		if (/[^\s]+/.test(newMessage.msg)) {
			try {
				console.log("in Service")
				if (await this.isUserInChannel(channelId, userId) == false) {
					return false
				}
				const ret = await this.prisma.messages.create({
					data: {
						content: newMessage.msg.trim(),
						senderId: userId,
						channelId: channelId,
					}
				})
			}
			catch (e) {
				Logger.log("Can't add msg");
				return false
			}
		}
		return false
	}

	async getChannelMessages(channelId: number, userId: number) {
		try {
			if (await this.isUserInChannel(channelId, userId) == false) {
				return { message: "You are not in this channel" }
			}
			const messages = await this.prisma.messages.findMany({
				where: {
					channelId: channelId
				},
				select: {
					sender: {
						select: {
							name: true,
						}
					},
					content: true,
					createdAt: true,
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
				id: { channelId: channelId, userId: userId }
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
		console.log(channel.users)
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
				console.log(channelName);
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

	async muteUser(channelId: number, targetName: string, time: number, userId: number) {
		if (time < 0 || time > 86400)
			return { message: "Time must be in range [0-86400] seconds" }
		const userStatus = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId }
			},
			select: {
				status: true
			}
		})
		const targetUser = await this.prisma.userChannelMap.findFirst({
			where: {
				channelId: channelId,
				user: {
					name: targetName,
				}
			}

		});
		if (!targetUser) {
			return { message: "User not found in this channel" }
		}

		if ((userStatus.status == "OWNER" || userStatus.status == "ADMIN") && targetUser.status != "OWNER" && userId != targetUser.userId) {
			await this.prisma.userChannelMap.update({
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
}
