import { IUserRepository } from '../repositories/IUserRepository';
import { NotFoundError } from '../../tools/errors';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
  ) { }

  get() {
    return this.userRepository.get();
  }

  async getId(id: string) {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`)
    }
    return user;
  }

  async register(recruit: any) {
    return this.userRepository.register(recruit);
  }

  update(user: any) {
    return this.userRepository.update(user);
  }

  async delete(id: string) {
    await this.userRepository.delete(id)
  }
}