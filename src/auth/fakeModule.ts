import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './primaryAdapter/controller';
import { IAuthRepository } from './repositories/IAuthRepository';

@Module({})
export class FakeAuthModule {
    static forRoot(mock: Partial<IAuthRepository>): DynamicModule {
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
                    provide: 'authRepository',
                    useValue: mock,
                },
            ],
            controllers: [AuthController],
        };
    }
}