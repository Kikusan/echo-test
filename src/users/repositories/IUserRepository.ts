import { ReadUser, Search, UserToBeRegistered, UserToBeUpdated, Page } from "../services/types";

export interface IUserRepository {
  get(search: Search): Promise<Page>;
  getById(id: string): Promise<ReadUser | null>;
  getByNickname(nickname: string): Promise<ReadUser | null>
  register(user: UserToBeRegistered): Promise<ReadUser>;
  update(user: UserToBeUpdated): Promise<ReadUser>;
  delete(id: string): Promise<void>;
}
