import {
  ReadUser,
  Search,
  UserToBeRegistered,
  UserToBeUpdated,
  Page,
  UserWithPass
} from "../services/types";

export interface IUserRepository {
  get(search: Search): Promise<Page>;
  getById(id: string): Promise<UserWithPass | null>;
  getByNickname(nickname: string): Promise<UserWithPass | null>
  register(user: UserToBeRegistered): Promise<ReadUser>;
  update(user: UserToBeUpdated): Promise<ReadUser>;
  delete(id: string): Promise<void>;
}
