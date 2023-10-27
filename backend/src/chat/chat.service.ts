import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { ChatGateway } from './chat.gateway';
import * as bcrypt from 'bcrypt';
import { NewMessageDto } from './dto/new-message/new-message.dto';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService, private gateway: ChatGateway)	{}

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

	async findChannelBySearch(searchTerm: string): Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			where: {
				name: {
					contains: searchTerm,
					mode: 'insensitive'
				}
			},
			select: {
				id: true,
				name: true,
				privacy: true,
			}
		});
		return channels;
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
				Logger.log(existingChannel, "ChatService");
				existingChannel["message"] = "This channel already exists";
				return existingChannel;
			}
			const channel = await tx.channels.create({
				data: {
					name: newChannel.name,
					privacy: newChannel.privacy,
					ownerId: userId,
					// add password if privacy is PASSWORD_PROTECTED
					...(newChannel.privacy === "PASSWORD_PROTECTED" && { password: hashedPassword}),
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
			const hashedPassword : string = channel["password"];
			const passIsOk = await bcrypt.compare(password, hashedPassword);
			if (!passIsOk) {
				Logger.log(`Invalid password for channel [${channelId}]`, "ChatService");
				return { message: "Invalid password",  };
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

	async addNewMessage( channelId: number, newMessage: NewMessageDto, userId: number) {
		try {
			console.log("in Service")
			if (await this.isUserInChannel(channelId, userId) == false) {
				return false
			}
			const ret = await this.prisma.messages.create({
				data: {
					content: newMessage.msg,
					senderId: userId,
					channelId: channelId,
				}
			})
		}
		catch (e) {
			Logger.log("Can't add msg");
			return false
		}
		return false
	}

	async getChannelMessages(channelId: number, userId: number) {
		try {
			if (await this.isUserInChannel(channelId, userId) == false) {
				return {message: "You are not in this channel"}
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
			return {message: "Can't get messages", "error": e}
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
}
