import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { ChatGateway } from './chat.gateway';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService, private gateway: ChatGateway)	{}

	saltOrRounds = 10;

	async findAllChannels(): Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			// select: {
			// 	name: true,
			// },
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
						name: true,
					}
				}
			},
		});

		const channels = userChannelMaps.map(userChannelMap => userChannelMap.channel);
		return channels;
	}

	async getChannelByName(channelName: string): Promise<PrismaPromise<any>> {
		const channel = await this.prisma.channels.findUnique({
			where: {
				name: channelName,
			}
		});
		if (!channel) {
			Logger.log("Channel not found", channelName);
			throw new NotFoundException("Channel not found");
		}
		this.gateway.changeRoom(channelName)
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
				name: true,
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
		console.log(newChannel);
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
		this.joinChannel(channel.id, userId, newChannel.password);
		return channel;
	}

	// function who return true if user is in channel
	async isUserInChannel(channelId: number, userId: number): Promise<boolean> {
		const userChannelMap = await this.prisma.userChannelMap.findUnique({
			where: {
				id: { channelId: channelId, userId: userId }
			}
		});
		return !!userChannelMap;
	}

	async joinChannel(channelId: number, userId: number, password?: string) {
		console.log("password", password);
		if (channelId < 1 || Number.isNaN(channelId))
			throw new BadRequestException(`Invalid channel id (${channelId})`);

		if (await this.isUserInChannel(channelId, userId)) {
			console.log("User already in channel");
			return;
		}

		const channel = await this.prisma.channels.findUnique({
			where: {
				id: channelId,
			},
		});
		if (channel.privacy === "PASSWORD_PROTECTED") {
			const hashedPassword : string = channel["password"];
			console.log("hashedPassword", hashedPassword);
			const passIsOk = await bcrypt.compare(password, hashedPassword);
			if (!passIsOk) {
				Logger.log(`Invalid password for channel [${channelId}]`, "ChatService");
				return { message: "Invalid password" };
			}
		}

		const ret = await this.prisma.userChannelMap.create({
			data: {
				channelId: channelId,
				userId: userId,
			}
		});
		Logger.log(`User [${userId}] joined channel [${channelId}]`, "ChatService");
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
}
