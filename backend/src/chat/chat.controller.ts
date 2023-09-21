import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/auth/decorators/public.decorator';




@Public()
@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Get()
	getAllChannels() {
		return this.chatService.getAllChannels();
	}

	@Get(':channelName')
	getChannelByName(@Param('channelName') channelName: string) {
		return this.chatService.getChannelByName(channelName);
	}

}
