export type UserToBeRegistered = {
    nickname: string,
    password: string,
    name?: string,
    comment?: string,
    address?: string,
    role: Role
}

export type UserToBeUpdated = {
    id: string,
    nickname: string,
    password: string,
    name?: string,
    comment?: string,
    address?: string,
    role: Role
}


export type ReadUser = {
    id: string,
    nickname: string,
    name?: string,
    comment?: string,
    address?: string,
    role: string
}

export type UserWithPass = {
    id: string,
    nickname: string,
    password: string,
    role: string
}

export type UserWithRefreshTokens = {
    id: string,
    refreshToken: string | null,
    nickname: string,
    role: string
}

export type Role = {
    id: string,
    name: string
}

export type Requester = {
    id: string,
    nickname: string,
}