import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, Auth2faDto } from './dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { is2fa } from './decorators/2fa.decorator';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private usersService: UsersService) {}

    @Public()
    @Post('login')
    login(@Body() dto: AuthDto, @Res() res: Response) {
        return this.authService.login(dto, res)
    }

    @is2fa()
    @Post('2fa')
    login2fa(@Body() dto: Auth2faDto, @Res() res: Response, @Req() req) {
        return this.authService.login2fa(dto, res, req.user.id)
    }
}
