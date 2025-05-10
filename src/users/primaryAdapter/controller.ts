import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ReadUserDTO } from './dto/readUser.dto';
import { UserService } from '../services/service';
import { UserDTO } from './dto/user.dto';
import { Page, Requester } from '../services/types';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { RolesGuard } from '../../guard/roles.guard';
import { SearchDto, SortOrder } from './dto/search.dto';
import { Roles } from '../../decorator/roles.decorator';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @ApiQuery({ name: 'page', type: Number, description: 'Le numéro de la page' })
  @ApiQuery({ name: 'pageSize', type: Number, description: 'Le nombre d\'éléments par page' })
  @ApiQuery({ name: 'sort', type: String, enum: Object.values(SortOrder), description: 'Ordre de tri des résultats', required: false })
  @ApiQuery({ name: 'nickname', type: String, description: 'filter by nickname', required: false })
  @ApiQuery({ name: 'role', type: String, description: 'filter by role', required: false })
  @Get()
  async get(@Request() req: ExpressRequest, @Query() searchDto: SearchDto): Promise<Page> {
    const requester: Requester = req.user as Requester;
    const search = {
      page: searchDto.page,
      pageSize: searchDto.pageSize,
      sort: searchDto.sort as SortOrder,
      filter: {
        nickname: searchDto.nickname,
        role: searchDto.role
      }
    }
    const user = await this.userService.get(requester, search);
    return user;
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @ApiBearerAuth('jwt')
  async update(@Request() req: ExpressRequest, @Param('id', new ParseUUIDPipe()) id: string, @Body() userToBeUpdated: UserDTO): Promise<ReadUserDTO> {
    const requester: Requester = req.user as Requester;
    const updatedUser = await this.userService.update(requester, { ...userToBeUpdated, id });
    return updatedUser;

  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('jwt')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req: ExpressRequest, @Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    const requester: Requester = req.user as Requester;
    await this.userService.delete(requester, id);
  }

}


