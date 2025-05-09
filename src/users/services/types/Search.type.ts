import { ReadUser } from "./User.type"

export enum SortOrder {
    NicknameAsc = "nickname:asc",
    NicknameDesc = "nickname:desc",
    RoleAsc = "role:asc",
    RoleDesc = "role:desc",
    CreatedAsc = "createdAt:asc",
    CreatedDesc = "createdAt:desc",
    UpdatedAsc = "updatedAt:asc",
    UpdatedDesc = "updatedAt:desc"
}

export type Filter = {
    nickname?: string,
    role?: string,
}

export type Search = {
    page: number,
    pageSize: number,
    sort?: SortOrder,
    filter?: Filter
}

export type Page = {
    users: ReadUser[],
    totalPages: number,
    totalResult: number
}