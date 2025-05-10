import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.nickname, body.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }
}
