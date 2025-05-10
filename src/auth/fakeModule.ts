import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller';
import { UserService } from '../users/services/service';

@Module({})
export class FakeAuthModule {
    static forRoot(mock: Partial<UserService>): DynamicModule {
        return {
            module: FakeAuthModule,
            imports: [
                PassportModule,
                JwtModule.register({
                    secret: process.env.SECRET_KEY ?? 'secret_temp_key',
                    signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? '1h' },
                }),
            ],
            providers: [
                AuthService,
                JwtStrategy,
                {
                    provide: UserService,
                    useValue: mock,
                },
            ],
            controllers: [AuthController],
        };
    }
}