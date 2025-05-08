import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserRepository } from '../IUserRepository';
import { ReadUser, UserToBeRegistered, UserToBeUpdated } from '../../services/User.type'

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    private readonly userRepository: Repository<User>,
  ) { }

  async get(): Promise<ReadUser[]> {
    const users = await this.userRepository.find()
    return users.map(user => this.mapTypeORMToUserDomain(user))
  }
  async getById(id: string): Promise<ReadUser | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? this.mapTypeORMToUserDomain(user) : null
  }

  async getByNickname(nickname: string): Promise<ReadUser | null> {
    const user = await this.userRepository.findOne({ where: { nickname } })
    return user ? this.mapTypeORMToUserDomain(user) : null
  }
  async register(user: UserToBeRegistered): Promise<ReadUser> {
    const registeredUser = await this.userRepository.save(user);
    return this.mapTypeORMToUserDomain(registeredUser)
  }
  async update(user: UserToBeUpdated): Promise<ReadUser> {
    const updatedUser = await this.userRepository.save(user);
    return this.mapTypeORMToUserDomain(updatedUser)
  }
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }

  private mapTypeORMToUserDomain(user: User): ReadUser {
    const { id, nickname, name, address, comment, role } = user;
    return { id, nickname, address, name, comment, role: role.name }
  }
}