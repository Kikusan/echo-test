import { IUserRepository } from '../repositories/IUserRepository';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../tools/errors';
import { UserToBeRegistered, UserToBeUpdated, Search, Requester, ReadUser } from './types';
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

  async get(requester: Requester, search: Search = this.defaultSearch,): Promise<Page> {
    const requesterWithRole = await this.userRepository.getById(requester.id)
    if (!requesterWithRole) {
      throw new UnauthorizedError(`unknown requester`);
    }
    this.isAdmin(requesterWithRole);
    return this.userRepository.get(search);
  }



  async register(user: UserToBeRegistered) {
    const userWithSameNickname = await this.userRepository.getByNickname(user.nickname)
    if (userWithSameNickname) {
      throw new BadRequestError('username already used')
    }
    const UserToBeRegistered = await UserEntity.createWithPassword(user)
    return this.userRepository.register(UserToBeRegistered);
  }

  async update(requester: Requester, user: UserToBeUpdated) {
    const requesterWithRole = await this.userRepository.getById(requester.id)
    if (!requesterWithRole) {
      throw new UnauthorizedError(`unknown requester`);
    }
    this.isAllowedToUpdate(requesterWithRole, user);
    const userTobeUpdated = await this.userRepository.getById(user.id)

    if (!userTobeUpdated) {
      throw new NotFoundError('user not found')
    }
    const userWithSameNickname = await this.userRepository.getByNickname(user.nickname)
    if (userWithSameNickname && userWithSameNickname.id !== user.id) {
      throw new BadRequestError('username already used')
    }
    const userToBeUpdated = await UserEntity.createWithPassword(user)
    return this.userRepository.update({ ...userToBeUpdated, id: user.id });
  }

  async delete(requester: Requester, id: string) {
    const requesterWithRole = await this.userRepository.getById(requester.id)
    if (!requesterWithRole) {
      throw new UnauthorizedError(`unknown requester`);
    }
    this.isAdmin(requesterWithRole);
    const userTobeDeleted = await this.userRepository.getById(id)
    if (!userTobeDeleted) {
      throw new NotFoundError('user not found')
    }
    await this.userRepository.delete(id)
  }

  private isAllowedToUpdate(requesterWithRole: ReadUser, user: UserToBeUpdated) {
    if (requesterWithRole.id === user.id) {
      return;
    }
    this.isAdmin(requesterWithRole);

  }

  private isAdmin(requesterWithRole: ReadUser) {
    if (requesterWithRole.role !== 'admin') {
      throw new ForbiddenError(`Requester ${requesterWithRole.nickname} is not authorized to perform this action`);
    }
  }
}