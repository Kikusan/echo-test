import {
  ReadUser,
  Search,
  UserToBeRegistered,
  UserToBeUpdated,
  Page,
  UserWithPass,
  UserWithRefreshTokens
} from "../services/types";

export interface IUserRepository {
  get(search: Search): Promise<Page>;
  getById(id: string): Promise<UserWithRefreshTokens | null>;
  getByNickname(nickname: string): Promise<UserWithPass | null>
  register(user: UserToBeRegistered): Promise<ReadUser>;
  update(user: UserToBeUpdated): Promise<ReadUser>;
  delete(id: string): Promise<void>;
  logout(id: string): Promise<void>;
  refreshToken(userId: string, hashedToken: string): Promise<void>;
}
