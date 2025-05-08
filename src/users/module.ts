import { Module } from '@nestjs/common';
import { UserController } from './primaryAdapter/controller';
import { UserService } from './services/service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './repositories/typeORM/entities/user.entity';
import { TypeOrmUserRepository } from './repositories/typeORM/TypeORMUserRepository';
@Module({
  imports: [
    TypeOrmModule.forFeature([User
    ]),
  ],
  controllers: [UserController],
  providers: [
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
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class UserModule { }
