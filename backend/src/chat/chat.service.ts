import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Privacy } from '@prisma/client';
import { PrismaService, } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';

@Injectable()
export class ChatService {
	constructor(private readonly prisma: PrismaService)	{}

	
	async getAllChannels() {
		const channels = await this.prisma.channels.findMany({
			// select: {
			// 	name: true,
			// },
		});
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


	async createChannel(newChannel : CreateChannelDto) {
		// return newChannel;
		try {
			const channel = await this.prisma.channels.create({
				data: newChannel
			});
			return channel;
		}
		catch (err) {
			Logger.error(err);
			return err;
		}
	}
}
