import { IUserRepository } from '../repositories/IUserRepository';
import { BadRequestError, NotFoundError } from '../../tools/errors';
import { UserToBeRegistered, UserToBeUpdated } from './User.type';
import { UserEntity } from './User.entity';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  get() {
    return this.userRepository.get();
  }

  async register(user: UserToBeRegistered) {
    const userWithSameNickname = await this.userRepository.getByNickname(user.nickname)
    if (userWithSameNickname) {
      throw new BadRequestError('username already used')
    }
    const UserToBeRegistered = await UserEntity.createWithPassword(user)
    return this.userRepository.register(UserToBeRegistered);
  }

  async update(user: UserToBeUpdated) {
    const userTobeDeleted = await this.userRepository.getById(user.id)
    if (!userTobeDeleted) {
      throw new NotFoundError('user not found')
    }
    const userWithSameNickname = await this.userRepository.getByNickname(user.nickname)
    if (userWithSameNickname && userWithSameNickname.id !== user.id) {
      throw new BadRequestError('username already used')
    }
    const UserToBeRegistered = await UserEntity.createWithPassword(user)
    return this.userRepository.update(UserToBeRegistered);
  }

  async delete(id: string) {
    const userTobeDeleted = await this.userRepository.getById(id)
    if (!userTobeDeleted) {
      throw new NotFoundError('user not found')
    }
    await this.userRepository.delete(id)
  }
}