import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'user nickname'
    })
    @IsNotEmpty()
    readonly nickname: string;

    @ApiProperty({
        description: 'User password',
    })
    @IsNotEmpty()
    readonly password: string;
}