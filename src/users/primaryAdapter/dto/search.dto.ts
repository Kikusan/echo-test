import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

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

export class SearchDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    page: number;

    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    pageSize: number;

    @IsOptional()
    @IsEnum(SortOrder)
    sort?: string;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsString()
    role?: string;
}
