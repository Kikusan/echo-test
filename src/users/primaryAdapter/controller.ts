import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RegisterUserDTO } from './dto/registerUser.dto';
import { ReadUserDTO } from './dto/readUser.dto';

import { UserService } from '../services/service';
import { UserDTO } from './dto/user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async get(): Promise<any[]> {
    const user = await this.userService.get();

    return user;
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDTO> {
    const user = await this.userService.getId(id);
    return user;
  }

  @Post()
  async register(@Body() newUser: UserDTO): Promise<ReadUserDTO> {
    const userTobeRegistered = {
      ...newUser
    }
    const registeredUser = await this.userService.register(userTobeRegistered);
    return registeredUser;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userToBeUpdated: UserDTO): Promise<ReadUserDTO> {
    const updatedUser = await this.userService.update({ ...userToBeUpdated, id });
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }

}


