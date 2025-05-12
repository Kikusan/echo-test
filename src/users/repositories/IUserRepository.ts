import {
  ReadUser,
  Search,
  UserToBeRegistered,
  UserToBeUpdated,
  Page,
  UserWithRefreshTokens,
  UserPresence
} from "../services/types";

export interface IUserRepository {
  get(search: Search): Promise<Page>;
  getById(id: string): Promise<UserWithRefreshTokens | null>;
  getByNickname(nickname: string): Promise<UserPresence | null>
  register(user: UserToBeRegistered): Promise<ReadUser>;
  update(user: UserToBeUpdated): Promise<ReadUser>;
  delete(id: string): Promise<void>;
}
