import {
  UserWithPass,
  UserWithRefreshTokens
} from "./auth.type";

export interface IAuthRepository {
  getById(id: string): Promise<UserWithRefreshTokens | null>;
  getByNickname(nickname: string): Promise<UserWithPass | null>
  logout(id: string): Promise<void>;
  refreshToken(userId: string, hashedToken: string): Promise<void>;
}
