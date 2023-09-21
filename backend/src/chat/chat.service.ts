import { Injectable } from '@nestjs/common';
import { Channels, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

@Injectable()
export class ChatService {
	getAllChannels() {
		const channels = prisma.channels.findMany({
			select: {
				name: true,
			},
		});
		return channels;
	}

	getChannelByName(channelName: string) {
		const channel = prisma.channels.findFirst({
			where: {
				name: channelName,
			}
		});
		return channel;

	}
}
