import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

		
	@Get()
	async getAllChannels() {
		return await this.chatService.getAllChannels();
	}

	@Get(':channelName')
	async getChannelByName(@Param('channelName') channelName: string) {
		return await this.chatService.getChannelByName(channelName);
	}

	@Post()
	createChannel(@Body() newChannel) {
		return this.chatService.createChannel(newChannel.channelName, newChannel.privacy, newChannel.ownerId);
	}

}
