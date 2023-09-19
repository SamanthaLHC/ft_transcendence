import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

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
    findme(@Request() req) {
        return this.usersService.getUserFromId(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('gameHistorique/:id')
    gethisto(@Param('id') id: string) {
        return this.usersService.getHistoFromId(id);
    }
}
