import { Body, Controller, Delete, Get, Logger, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateChannelDto } from './dto/create-channel/create-channel.dto';
import { PrismaPromise, Privacy } from '@prisma/client';
import { use } from 'passport';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}
	

	// @UseGuards(AuthGuard)
	@Public()
	@Get('channels')
	async findAllChannels() {
		return await this.chatService.findAllChannels();
	}

	@UseGuards(AuthGuard)
	@Get('channels/joined')
	async findAllJoinedChannels(@Req() req) {
		return await this.chatService.findAllJoinedChannels(req.user.sub);
	}
	
	// @UseGuards(AuthGuard)
	@Public()
	@Get('channel/:channelName')
	async getChannelByName(@Param('channelName') channelName: string) :Promise<PrismaPromise<any>>{
		return await this.chatService.getChannelByName(channelName);
	}

	// @UseGuards(AuthGuard)
	@Public()
	@Get('channel')
	async findChannelBySearch(@Query('search') searchTerm: string) {
		return await this.chatService.findChannelBySearch(searchTerm);
	}

	// @UseGuards(AuthGuard)
	@Public()
	@Post('channel/create')
	async createChannelIfNotExists(@Body() newChannel : CreateChannelDto ) {
		return await this.chatService.createChannelIfNotExists(newChannel);
	}

	@UseGuards(AuthGuard)
	@Post('channel/join/:channelId')
	async joinChannel(@Param('channelId') channelId: string, @Req() req) {
		return await this.chatService.joinChannel(+channelId, req.user.sub);
	}

	@UseGuards(AuthGuard)
	@Delete('channel/leave/:channelId')
	async leaveChannel(@Param('channelId') channelId: string, @Req() req) {
		return await this.chatService.leaveChannel(+channelId, req.user.sub);
	}
}
