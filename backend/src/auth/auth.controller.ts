import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private authService: AuthService) {}

    @Post('login')
    login(@Body() code: object) {
		//DEBUGG
		console.log("code in controller:")
		console.log(code)
        return this.authService.login(code)
    }
}
