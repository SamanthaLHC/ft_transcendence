import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { Privacy } from '@prisma/client';


@Public()
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	testChannel : CreateChannelDto =
	{
		"name" : "tdfhdfghf",
		"privacy" : Privacy.PUBLIC,
		"ownerId" : 1
	}
		
	@Get()
	async getAllChannels() {
		return await this.chatService.getAllChannels();
	}

	@Get(':channelName')
	async getChannelByName(@Param('channelName') channelName: string) {
		return await this.chatService.getChannelByName(channelName);
	}

	@Post()
	async createChannel(@Body() newChannel : CreateChannelDto ) {
		return await this.chatService.createChannel(newChannel);
	}

}
