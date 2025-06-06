import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserToken } from '../services/UserToken.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY ?? 'secret_temp_key',
        });
    }

    async validate(payload: any): Promise<UserToken> {
        return { id: payload.sub, nickname: payload.nickname, role: payload.role };
    }
}