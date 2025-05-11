import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { AuthService } from './service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller';
import { UserService } from '../users/services/service';
import { TypeOrmUserRepository } from '../users/repositories/typeORM/TypeORMUserRepository';
import { User } from '../users/repositories/typeORM/entities/user.entity';

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
            provide: UserService,
            useFactory: (
                userRepository,
            ) => {

                return new UserService(
                    userRepository,
                );
            },
            inject: [
                'userRepository',
            ],
        },
        {
            provide: 'userRepository',
            inject: [DataSource],
            useFactory: (dataSource: DataSource) => {
                const ormRepo = dataSource.getRepository(User);
                return new TypeOrmUserRepository(ormRepo);
            },
        },

    ],
    controllers: [AuthController],
})
export class AuthModule { }