import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Channels, PrismaPromise, Privacy } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService)	{}

	async findAllChannels() : Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			// select: {
			// 	name: true,
			// },
		});
		return channels;
	}

	async findAllJoinedChannels(userId: number) : Promise<PrismaPromise<any>> {
		const channels = await this.prisma.userChannelMap.findMany({
			where: {
				userId: userId,
			},
			select: {
				channel: true
			}
		});
		return channels;
	}

	async getChannelByName(channelName: string) : Promise<PrismaPromise<any>> {
		const channel = await this.prisma.channels.findUnique({
			where: {
				name: channelName,
			}
		});
		if (!channel)
		{
			Logger.log("Channel not found", channelName);
			throw new NotFoundException("Channel not found");
		}
		return channel;
	}

	async findChannelBySearch(searchTerm: string) : Promise<PrismaPromise<any>> {
		const channels = await this.prisma.channels.findMany({
			where: {
				name: {
					contains: searchTerm, 
					mode: 'insensitive'
				}
			}
		});
		return channels;
	}

	async createChannelIfNotExists(newChannel : CreateChannelDto) : Promise<PrismaPromise<any>> {
		const channel = await this.prisma.$transaction(async (tx) => {
			const existingChannel = await tx.channels.findUnique({
				where: {
					name: newChannel.name,
				}
			});
			if (existingChannel)
			{
				Logger.log("Channel already exists", "ChatService");
				Logger.log(existingChannel, "ChatService");
				throw new ConflictException("Channel already exists");
			}
			const channel = await tx.channels.create({
				data: newChannel,
			});
			return channel;
		});
		Logger.log(`Channel [${channel.name}] created`, "ChatService");
		this.joinChannel(channel.id, newChannel.ownerId);
		return channel;
	}

	async joinChannel(channelId: number, userId: number){
		const ret = await this.prisma.userChannelMap.create({
			data: {
				channelId: channelId,
				userId: userId,
			}
		});
		Logger.log(`User [${userId}] joined channel [${channelId}]`, "ChatService");
	}

	async leaveChannel(channelId: number, userId: number){
		const ret = await this.prisma.userChannelMap.delete({
			where: {
				id: {channelId: channelId, userId: userId}
			}
		});
		Logger.log(`User [${userId}] left channel [${channelId}]`, "ChatService");
	}
}
