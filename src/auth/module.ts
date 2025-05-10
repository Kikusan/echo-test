import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/module';
import { AuthService } from './service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller';

@Module({
    imports: [
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY ?? 'secret_temp_key',
            signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule { }