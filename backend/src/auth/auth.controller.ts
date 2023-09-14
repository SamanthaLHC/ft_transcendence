import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Public()
    @Post('login')
    login(@Body() dto: AuthDto) {
        return this.authService.login(dto)
    }
}
