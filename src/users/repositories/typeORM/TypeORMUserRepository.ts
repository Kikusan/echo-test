import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserRepository } from '../IUserRepository';
import { Page, ReadUser, Search, UserToBeRegistered, UserToBeUpdated } from '../../services/types'

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    private readonly userRepository: Repository<User>,
  ) { }

  async get(search: Search): Promise<Page> {
    const { page, pageSize, sort, filter } = search;

    const qb = this.userRepository.createQueryBuilder("user").leftJoinAndSelect("user.role", "role");;
    if (filter?.nickname) {
      qb.andWhere("user.nickname ILIKE :nickname", { nickname: `%${filter.nickname}%` });
    }
    if (filter?.role) {
      qb.andWhere("role.name ILIKE :role", { role: filter.role });
    }
    if (sort) {
      const [field, direction] = sort.split(":");
      qb.orderBy(`user.${field}`, direction.toUpperCase() as "ASC" | "DESC");
    }
    qb.skip((page - 1) * pageSize).take(pageSize);

    const result = await qb.getManyAndCount();
    const pageResult: Page = {
      users: result[0].map(user => this.mapTypeORMToUserDomain(user)),
      totalPages: Math.ceil(result[1] / pageSize),
      totalResult: result[1]
    }
    return pageResult;
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
    const updatedUser = await this.userRepository.save({ ...user, updatedAt: new Date() });
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