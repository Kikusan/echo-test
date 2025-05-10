import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../users/services/service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(nickname: string, pass: string): Promise<UserToken | null> {
        const user = await this.userService.getByNickname(nickname);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: UserToken) {
        const payload = { role: user.role, nickname: user.nickname, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}

export type UserToken = {
    id: string,
    nickname: string,
    role: string
}