import { Injectable, NotFoundException } from '@nestjs/common';
import { Privacy } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService)	{}

	
	async getAllChannels() {
		const channels = await this.prisma.channels.findMany({
			select: {
				name: true,
			},
		});
		// if (!channels)
		// 	throw new NotFoundException('No channels found');
		return channels;
	}

	async getChannelByName(channelName: string){
		const channel = await this.prisma.channels.findUnique({
			where: {
				name: channelName,
			}
		});
		if (!channel)
			throw new NotFoundException("Channel not found");
		return channel;
	}

	async createChannel(channelName: string, privacy: Privacy, ownerId: number) {
		const channel = await this.prisma.channels.create({
			data: {
				name: channelName,
				privacy: privacy,
				ownerId: ownerId,
			}
		});
		return channel;
	}
}
