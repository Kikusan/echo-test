import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { AuthService } from './services/service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './primaryAdapter/controller';
import { TypeOrmAuthRepository } from './repositories/typeORM/TypeORMAuthRepository';
import { User } from './repositories/typeORM/entities/user.entity';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.SECRET_KEY ?? 'secret_temp_key',
            signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? '15m' },
        }),
    ],
    providers: [AuthService, JwtStrategy,
        {
            provide: 'authRepository',
            inject: [DataSource],
            useFactory: (dataSource: DataSource) => {
                const ormRepo = dataSource.getRepository(User);
                return new TypeOrmAuthRepository(ormRepo);
            },
        },

    ],
    controllers: [AuthController],
})
export class AuthModule { }