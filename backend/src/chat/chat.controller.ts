import { Body, Controller, Delete, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { PrismaPromise } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewMessageDto } from './dto/new-message/new-message.dto';
import { UpdateChannelDto } from './dto/update-channel/update-channel.dto';

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
	@Get('channel/:channelName')
	async getChannelByName(@Param('channelName') channelName: string) :Promise<PrismaPromise<any>>{
		return await this.chatService.getChannelByName(channelName);
	}

	@UseGuards(AuthGuard)
	@Post('channel/create')
	async createChannelIfNotExists(@Body() newChannel : CreateChannelDto, @Req() req) {
		return await this.chatService.createChannelIfNotExists(newChannel, req.user.sub);
	}
	
	@UseGuards(AuthGuard)
	@Post('channel/msg/:channelName')
	async addNewMessage(@Body() newMessage: NewMessageDto, @Req() req) :Promise<Boolean>{
		console.log ("in control")
		return await this.chatService.addNewMessage(newMessage, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('channel')
	async findChannelBySearch(@Query('search') searchTerm: string) {
		return await this.chatService.findChannelBySearch(searchTerm);
	}


	@UseGuards(AuthGuard)
	@Post('channel/join/:channelId')
	async joinChannel(@Param('channelId') channelId: string, @Req() req, @Body() body? : {password?: string}) {
		return await this.chatService.joinChannel(+channelId, req.user.sub, body?.password);
	}

	@UseGuards(AuthGuard)
	@Delete('channel/leave/:channelId')
	async leaveChannel(@Param('channelId') channelId: string, @Req() req) {
		return await this.chatService.leaveChannel(+channelId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('messages/:channelName')
	async getChannelMessages(@Param('channelName') channelName: string, @Req() req) :Promise<PrismaPromise<any>>{
		console.log ("in control getChannelMessages")
		console.log (channelName)
		return await this.chatService.getChannelMessages(channelName, req.user.sub);
	}

}
