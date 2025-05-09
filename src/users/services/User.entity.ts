import * as bcrypt from 'bcryptjs';
import { Role, UserToBeRegistered } from './types';

export class UserEntity {
    nickname: string;
    password: string;
    name?: string;
    comment?: string;
    address?: string;
    role: Role;

    private constructor(
        userToBeRegistered: UserToBeRegistered
    ) {
        this.nickname = userToBeRegistered.nickname;
        this.password = userToBeRegistered.password;
        this.role = userToBeRegistered.role;
        this.name = userToBeRegistered.name;
        this.comment = userToBeRegistered.comment;
        this.address = userToBeRegistered.address;
    }

    static async createWithPassword(userToBeRegistered: UserToBeRegistered): Promise<UserEntity> {
        const hashedPassword = await bcrypt.hash(userToBeRegistered.password, 10);
        return new UserEntity({ ...userToBeRegistered, password: hashedPassword });
    }
}

type UserData = {}
