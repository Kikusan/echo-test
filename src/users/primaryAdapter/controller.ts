import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadUserDTO } from './dto/readUser.dto';
import { UserService } from '../services/service';
import { UserDTO } from './dto/user.dto';
import { Page } from '../services/types';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiResponse({
    status: 200,
    description: 'Paged list of users',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            example: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              nickname: 'johndoe',
              name: 'John Doe',
              comment: 'Un commentaire',
              address: '123 rue principale',
              role: 'admin',
            },
          },
        },
        totalPages: {
          type: 'number',
          example: 5,
        },
        totalResult: {
          type: 'number',
          example: 100,
        },
      },
    },
  })
  @Get()
  async get(): Promise<Page> {
    try {
      const user = await this.userService.get();
      return user;
    } catch (e) {
      console.log(e)
      throw (e)
    }
  }

  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: 'c0f68e30-7d59-4cc2-a996-66e412e3fbfc',
        nickname: 'johndoe',
        name: 'John Doe',
        comment: 'Utilisateur actif',
        address: '123 Rue Exemple',
        role: 'admin',
      },
    },
  })
  @Post()
  async register(@Body() newUser: UserDTO): Promise<ReadUserDTO> {
    const userTobeRegistered = {
      ...newUser
    }
    const registeredUser = await this.userService.register(userTobeRegistered);
    return registeredUser;
  }

  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      example: {
        id: 'c0f68e30-7d59-4cc2-a996-66e412e3fbfc',
        nickname: 'johndoe',
        name: 'John Doe',
        comment: 'Utilisateur actif',
        address: '123 Rue Exemple',
        role: 'admin',
      },
    },
  })
  @Put(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() userToBeUpdated: UserDTO): Promise<ReadUserDTO> {
    try {
      const updatedUser = await this.userService.update({ ...userToBeUpdated, id });
      return updatedUser;
    } catch (e) {
      console.log(e)
      throw (e)
    }

  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.userService.delete(id);
  }

}


