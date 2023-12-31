import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChannelDto, JoinChannelPasswordDTO } from './dto/create-channel.dto';
import { PrismaPromise } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewMessageDto } from './dto/new-message.dto';
import { MuteDto } from './dto/mute.dto';
import { editChannelDto } from './dto/editchannel.dto';
import { getuserIDbyname } from './dto/getuserIDbyname/getuserIDbyname.dto';
import { upNameDto } from 'src/users/dto';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

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
	async createChannelIfNotExists(@Body() newChannel: CreateChannelDto, @Req() req) {
		return await this.chatService.createChannelIfNotExists(newChannel, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('new_message/:channelId')
	async addNewMessage(@Param('channelId') channelId: string, @Body() newMessage: NewMessageDto, @Req() req): Promise<any> {
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
	async createPrivateChannel(@Param('targetId') targetId: string, @Req() req) {
		return await this.chatService.createPrivateChannel(+targetId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/private/game/:targetId')
	async gamePrivateChannel(@Param('targetId') targetId: string, @Req() req) {
		const channel = await this.chatService.createPrivateChannel(+targetId, req.user.sub);
		if (channel["message"]){
			return channel
		}
		return await this.chatService.gamePrivateChannel(+targetId, req.user.sub, channel["id"])
	}

	@UseGuards(AuthGuard)
	@Post('channel/private/getname/:targetId')
	async getNamePrivateChannel(@Param('targetId') targetId: string, @Req() req) {
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
	@Post('gameinvite/refuser/:messageid')
	async refuseinv(@Param('messageid') messageid: string, @Req() req) {
		return await this.chatService.refuseinv(+messageid);
	}

	@UseGuards(AuthGuard)
	@Post('gameinvite/accepter/:messageid')
	async accepterinv(@Param('messageid') messageid: string, @Req() req) {
		return await this.chatService.accepterinv(+messageid);
	}

	@UseGuards(AuthGuard)
	@Get('messages/:channelId')
	async getChannelMessages(@Param('channelId') channelId: string, @Req() req): Promise<PrismaPromise<any>> {
		return await this.chatService.getChannelMessages(+channelId, req.user.sub);
	}

	/* Moderation */

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/mute')
	async muteUser(@Param('channelId') channelId: string, @Body() data: MuteDto, @Req() req) {
		return await this.chatService.muteUser(+channelId, data.targetName, +data.time, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Get('channel/:channelId/status')
	async getUserStatus(@Param('channelId') channelId: string, @Req() req) {
		return await this.chatService.getUserStatus(+channelId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/edit')
	async editChannel(@Param('channelId') channelId: string, @Req() req, @Body() data: editChannelDto) {
		return await this.chatService.editChannel(+channelId, req.user.sub, data);
	}

	@UseGuards(AuthGuard)
	@Post('getUserIdbyname')
	async getUserIdbyNmaeInchannel(@Body() dto: getuserIDbyname) {
		return await this.chatService.getUserIdbyNmaeInchannel(dto.ChannelId, dto.name);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/setAdmin')
	async setAdmin(@Param('channelId') channelId: string, @Body() data: upNameDto, @Req() req) {
		return await this.chatService.setAdmin(+channelId, data.name, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/unsetAdmin')
	async unsetAdmin(@Param('channelId') channelId: string, @Body() data: upNameDto, @Req() req) {
		return await this.chatService.unsetAdmin(+channelId, data.name, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/kick/:targetid')
	async kick(@Param('channelId') channelId: string, @Param('targetid') targetid: string, @Req() req) {
		return await this.chatService.kick(+channelId, req.user.sub, +targetid);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/ban/:targetid')
	async ban(@Param('channelId') channelId: string, @Param('targetid') targetid: string, @Req() req) {
		return await this.chatService.ban(+channelId, req.user.sub, +targetid);
	}

	@UseGuards(AuthGuard)
	@Post('channel/:channelId/unban/:targetid')
	async unban(@Param('channelId') channelId: string, @Param('targetid') targetid: string, @Req() req) {
		return await this.chatService.unban(+channelId, req.user.sub, +targetid);
	}
}
