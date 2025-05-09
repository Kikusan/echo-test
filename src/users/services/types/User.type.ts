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

export type Role = {
    id: string,
    name: string
}