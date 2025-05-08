import { ReadUser, UserToBeRegistered, UserToBeUpdated } from "../services/User.type";

export interface IUserRepository {
  get(): Promise<ReadUser[]>;
  getById(id: string): Promise<ReadUser | null>;
  getByNickname(nickname: string): Promise<ReadUser | null>
  register(user: UserToBeRegistered): Promise<ReadUser>;
  update(user: UserToBeUpdated): Promise<ReadUser>;
  delete(id: string): Promise<void>;
}
