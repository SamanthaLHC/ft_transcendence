import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { PrismaPromise, Privacy } from '@prisma/client';


@Public()
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	
	@Get('channels')
	// GET /chat/channel (return all channels)
	async findAllChannels() {
		return await this.chatService.findAllChannels();
	}

	@Get('channel/:channelName')
	// GET /chat/channel/[CHANNEL_NAME]
	async getChannelByName(@Param('channelName') channelName: string) :Promise<PrismaPromise<any>>{
		return await this.chatService.getChannelByName(channelName);
	}

	@Get('channel')
	// GET /chat/channel?search=[SEARCH_TERM]
	async findChannelBySearch(@Query('search') searchTerm: string) {
		return await this.chatService.findChannelBySearch(searchTerm);
	}

	@Post('channel/create')
	// POST /chat/channel/create (Body: {name: string, privacy: Privacy, ownerId: number})
	async createChannelIfNotExists(@Body() newChannel : CreateChannelDto ) {
		return await this.chatService.createChannelIfNotExists(newChannel);
	}
}
