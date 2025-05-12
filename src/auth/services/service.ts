import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { IAuthRepository } from '../repositories/IAuthRepository';
import { UserToken } from './UserToken.type';

@Injectable()
export class AuthService {
    constructor(
        @Inject('authRepository') private readonly authRepository: IAuthRepository,
        private readonly jwtService: JwtService
    ) { }

    private async validateUser(nickname: string, pass: string): Promise<UserToken | null> {
        const user = await this.authRepository.getByNickname(nickname);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(nickname: string, pass: string) {
        const user = await this.validateUser(nickname, pass);
        if (!user) {
            throw new UnauthorizedException();
        }
        const payload = { role: user.role, nickname: user.nickname, sub: user.id };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: process.env.JWT_EXPIRATION ?? '15m',
        });

        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            expiresIn: process.env.REFRESH_TOKEN_DURATION ?? '7d',
        });
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.authRepository.refreshToken(user.id, hashedRefreshToken);

        return {
            accessToken, refreshToken
        };
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        let payload: any;
        try {
            payload = this.jwtService.verify(refreshToken);
        } catch {
            throw new UnauthorizedException('Refresh token invalid or expired');
        }

        const user = await this.authRepository.getById(payload.sub);
        if (!user?.refreshToken) {
            throw new UnauthorizedException('User not found or refresh token missing');
        }

        const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isValid) {
            throw new UnauthorizedException('Refresh token incorrect');
        }
        const tokenContent = { role: user.role, nickname: user.nickname, sub: user.id };
        const accessToken = this.jwtService.sign(
            tokenContent,
            { expiresIn: process.env.JWT_EXPIRATION ?? '15m' },
        );

        const newRefreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: process.env.REFRESH_TOKEN_DURATION ?? '7d' },
        );

        const hashed = await bcrypt.hash(newRefreshToken, 10);
        await this.authRepository.refreshToken(user.id, hashed);

        return { accessToken, refreshToken: newRefreshToken };
    }

    logout(userId: string): Promise<void> {
        return this.authRepository.logout(userId)
    }

}

