import { IUserRepository } from '../repositories/IUserRepository';
import { BadRequestError, NotFoundError } from '../../tools/errors';
import { UserToBeRegistered, UserToBeUpdated, Search } from './types';
import { UserEntity } from './User.entity';
import { Page } from './types/Search.type';

export class UserService {
  private readonly defaultSearch: Search = {
    page: 1,
    pageSize: 10,
  }

  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  get(search: Search = this.defaultSearch): Promise<Page> {
    return this.userRepository.get(search);
  }

  async register(user: UserToBeRegistered) {
    const userWithSameNickname = await this.userRepository.getByNickname(user.nickname)
    console.log(userWithSameNickname)
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
    const userToBeUpdated = await UserEntity.createWithPassword(user)
    return this.userRepository.update({ ...userToBeUpdated, id: user.id });
  }

  async delete(id: string) {
    const userTobeDeleted = await this.userRepository.getById(id)
    if (!userTobeDeleted) {
      throw new NotFoundError('user not found')
    }
    await this.userRepository.delete(id)
  }
}