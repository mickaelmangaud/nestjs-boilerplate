import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('limit') limit: string, @Query('offset') offset: string): Promise<User[]> {
    return this.usersService.findAll(limit, offset);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const foundUser = await this.usersService.findByEmail(createUserDto.email);
    if (foundUser) {
      throw new ConflictException(`User with email ${createUserDto.email} alredy exists`);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);

    return await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const foundUser = await this.usersService.findOne(+id);
    if (!foundUser) {
      throw new NotFoundException(`User with id ${id} not Found`);
    }

    return foundUser;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    const userToUpdate = await this.usersService.findOne(+id);
    if (!userToUpdate) {
      throw new NotFoundException(`User with id ${id} not Found`);
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    const userToRemove = await this.usersService.findOne(+id);
    if (!userToRemove) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersService.remove(userToRemove);
  }
}
