import { Controller, Post, Body, UnauthorizedException, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.authService.login(body.nickname, body.password);
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refresh_token;
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.environnment === 'PROD',
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = (req.user as any).id;

        await this.authService.logout(userId);

        res.cookie('refresh_token', '', {
            httpOnly: true,
            secure: process.env.environnment === 'PROD',
            sameSite: 'strict',
            path: '/auth/refresh',
            expires: new Date(0),
        });

        return { message: 'Logged out successfully' };
    }
}
