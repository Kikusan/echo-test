import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IAuthRepository } from '../IAuthRepository';
import { UserWithPass, UserWithRefreshTokens } from '../auth.type'

export class TypeOrmAuthRepository implements IAuthRepository {
  constructor(
    private readonly userRepository: Repository<User>,
  ) { }

  async getById(id: string): Promise<UserWithRefreshTokens | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    return user ? this.mapTypeORMToUserWithRefreshToken(user) : null
  }

  async getByNickname(nickname: string): Promise<UserWithPass | null> {
    const user = await this.userRepository.findOne({ where: { nickname } })
    return user ? this.mapTypeORMToUserWithPass(user) : null
  }

  async refreshToken(userId: string, hashedToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: hashedToken });
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  private mapTypeORMToUserWithPass(user: User): UserWithPass {
    const { id, nickname, password, role } = user;
    return { id, nickname, password, role: role.name }
  }

  private mapTypeORMToUserWithRefreshToken(user: User): UserWithRefreshTokens {
    const { id, nickname, refreshToken, role } = user;
    return { id, nickname, refreshToken, role: role.name }
  }
}