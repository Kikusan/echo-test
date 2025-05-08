import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { RoleDto } from './role.dto';

export class ReadUserDTO {
  @ApiProperty({
    example: 'b7d21cf0-67d5-4db0-a1f7-eebd157fbb6f',
    description: 'UUID of the user'
  })
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
  @ApiProperty({
    example: 'popol',
    description: 'Nickname of the user'
  })
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    example: 'Robert',
    description: 'name of the user'
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'the one with the popol nickname',
    description: 'some comment about the user'
  })
  @IsString()
  readonly comment: string;

  @ApiProperty({
    example: 'Robert',
    description: 'adress of the user'
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    description: 'User role',
    type: RoleDto,
    example: { id: '22222222-2222-2222-2222-222222222222', name: 'admin' }
  })
  @IsNotEmpty()
  readonly role: RoleDto;
}