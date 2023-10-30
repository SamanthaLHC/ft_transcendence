import { Body, Controller, Delete, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelPasswordDTO, CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { PrismaPromise } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewMessageDto } from './dto/new-message/new-message.dto';
import { channel } from 'diagnostics_channel';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	
	@UseGuards(AuthGuard)
	@Get('channels')
	async findAllChannels() {
		return await this.chatService.findAllChannels();
	}

	@UseGuards(AuthGuard)
	@Get('channels/joined')
	async findAllJoinedChannels(@Req() req) {
		return await this.chatService.findAllJoinedChannels(req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/create')
	async createChannelIfNotExists(@Body() newChannel : CreateChannelDto, @Req() req) {
		return await this.chatService.createChannelIfNotExists(newChannel, req.user.sub);
	}
	
	@UseGuards(AuthGuard)
	@Post('new_message/:channelId')
	async addNewMessage( @Param('channelId') channelId: string, @Body() newMessage: NewMessageDto, @Req() req) :Promise<Boolean>{
		console.log ("in control")
		return await this.chatService.addNewMessage(+channelId, newMessage, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('channel')
	async findChannelBySearch(@Query('search') searchTerm: string) {
		return await this.chatService.findChannelBySearch(searchTerm);
	}


	@UseGuards(AuthGuard)
	@Post('channel/join/:channelId')
	async joinChannel(@Param('channelId') channelId: string, @Req() req, @Body() body?: ChannelPasswordDTO) {
		return await this.chatService.joinChannel(+channelId, req.user.sub, body.password);
	}

	@UseGuards(AuthGuard)
	@Delete('channel/leave/:channelId')
	async leaveChannel(@Param('channelId') channelId: string, @Req() req) {
		return await this.chatService.leaveChannel(+channelId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('messages/:channelId')
	async getChannelMessages(@Param('channelId') channelId: string, @Req() req) :Promise<PrismaPromise<any>>{
		console.log ("in control getChannelMessages")
		console.log (channelId)
		return await this.chatService.getChannelMessages(+channelId, req.user.sub);
	}

}
