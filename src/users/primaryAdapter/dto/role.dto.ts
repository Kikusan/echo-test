import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RoleDto {
  @ApiProperty({
    example: 'b7d21cf0-67d5-4db0-a1f7-eebd157fbb6f',
    description: 'UUID of the role'
  })
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;

  @ApiProperty({
    example: 'Earth',
    description: 'Name of the role',
    required: false
  })
  readonly name?: string;
}