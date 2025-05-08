import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IUserRepository } from '../IUserRepository';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  get(): Promise<any[]> {
    return this.userRepository.find()
  }
  getById(id: string): Promise<any> {
    return this.userRepository.findOne({ where: { id } });
  }
  register(user: any): Promise<any> {

    return this.userRepository.save(user);
  }
  update(user: any): Promise<any> {
    return this.userRepository.save(user);
  }
  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}