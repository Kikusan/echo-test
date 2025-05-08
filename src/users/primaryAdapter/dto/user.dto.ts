import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleDto } from './role.dto';

export class UserDTO {
  readonly id: string;
  @ApiProperty({
    example: 'popol',
    description: 'Nickname of the user'
  })
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    example: 'itIsASecret',
    description: 'Password of the user'
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({
    example: 'Robert',
    description: 'name of the user',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    example: 'the one with the popol nickname',
    description: 'some comment about the user',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly comment?: string;

  @ApiProperty({
    example: 'Robert',
    description: 'adress of the user',
    required: false
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({
    description: 'User role',
    type: RoleDto,
    example: { id: '22222222-2222-2222-2222-222222222222', name: 'admin' }
  })
  @IsNotEmpty()
  readonly role: RoleDto;
}


