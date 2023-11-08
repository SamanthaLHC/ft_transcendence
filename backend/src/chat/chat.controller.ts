import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto, JoinChannelPasswordDTO } from './dto/create-channel.dto';
import { PrismaPromise } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewMessageDto } from './dto/new-message.dto';
import { MuteDto } from './dto/mute.dto';

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
	async addNewMessage( @Param('channelId') channelId: string, @Body() newMessage: NewMessageDto, @Req() req) :Promise<any>{
		console.log ("in control")
		return await this.chatService.addNewMessage(+channelId, newMessage, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('channel')
	async findChannelBySearch(@Query('search') searchTerm: string, @Req() req) {
		return await this.chatService.findChannelBySearch(searchTerm, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/join/:channelId')
	async joinChannel(@Param('channelId') channelId: string, @Body() body: JoinChannelPasswordDTO, @Req() req) {
		return await this.chatService.joinChannel(+channelId, req.user.sub, body.password);
	}

	@UseGuards(AuthGuard)
	@Post('channel/private/create/:targetId')
	async createPrivateChannel(@Param('targetId') targetId : string, @Req() req) {
		return await this.chatService.createPrivateChannel(+targetId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/private/getname/:targetId')
	async getNamePrivateChannel(@Param('targetId') targetId : string, @Req() req) {
		return await this.chatService.getNamePrivateChannel(+targetId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('channel/:channelId')
	async getChannelById(@Param('channelId') channelId: string) {
		return await this.chatService.getChannelById(+channelId);
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

	@UseGuards(AuthGuard)
	// mute a user in a channel for a certain amount of time
	@Patch('channel/:channelId/mute')
	async muteUser(@Param('channelId') channelId: string, @Body() data : MuteDto, @Req() req) {
		console.log ("in control muteUser; channelId: ", channelId)
		return await this.chatService.muteUser(+channelId, data.targetName, +data.time, req.user.sub);
	}

}
