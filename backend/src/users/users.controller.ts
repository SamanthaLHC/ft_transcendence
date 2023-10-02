import { Controller, Get, Param, UseGuards, Post, Req, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { response } from 'express';
import { SearchDto, addRelationDto, rmRelationDto } from './dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('id/:id')
    findOne(@Param('id') id: string) {
        return this.usersService.getUserFromId(id);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    findme(@Req() req) {
        return this.usersService.getUserFromId(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('gameHistorique/:id')
    gethisto(@Param('id') id: string) {
        return this.usersService.getHistoFromId(id);
    }

    @Post('2fa/turn-on')
    @UseGuards(AuthGuard)
    async turnOnTwoFactorAuthentication(@Req() req) {
        const ret = await this.usersService.turnOnTwoFactorAuthentication(req.user.sub);
        console.log(ret.otpauthUrl);
        return {
            otpAuthUrl: await this.usersService.generateQrCodeDataURL(ret.otpauthUrl),
          };
    }

    @Post('2fa/turn-off')
    @UseGuards(AuthGuard)
    async turnOffTwoFactorAuthentication(@Req() req){
        this.usersService.turnOffTwoFactorAuthentication(req.user.sub)
    }

    @Get('search')
    @UseGuards(AuthGuard)
    async SearchUser(@Body() dto: SearchDto) {
        return this.usersService.searchUser(dto)
    }

    @Post('addup_relation')
    @UseGuards(AuthGuard)
    async addefriend(@Body() dto: addRelationDto, @Req() req){
        return this.usersService.addrelation(dto, req.user.sub);
    }

    @Get('status_relation')
    @UseGuards(AuthGuard)
    async getstatusfriend(@Body() dto: rmRelationDto, @Req() req){
        return this.usersService.getstatusrelation(dto, req.user.sub);
    }

    @Delete('rm_relation')
    @UseGuards(AuthGuard)
    async rmfriend(@Body() dto: rmRelationDto, @Req() req){
        return this.usersService.deleterelation(dto, req.user.sub);
    }

}
