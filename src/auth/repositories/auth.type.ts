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
