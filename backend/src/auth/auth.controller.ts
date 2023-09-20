import { Body, Controller, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, Auth2faDto } from './dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService, private usersService: UsersService) {}

    @Public()
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto)
    }

    @Public()
    @Post('2fa')
    login2fa(@Body() dto: Auth2faDto) {
        return this.authService.login2fa(dto)
    }
}
