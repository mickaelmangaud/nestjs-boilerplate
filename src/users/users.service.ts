import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(createdUser);
  }

  async findAll(limit: string, offset: string): Promise<User[]> {
    return await this.usersRepository.find({
      take: +limit || 0,
      skip: +offset || 0,
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne(+id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(user: User): Promise<User> {
    return await this.usersRepository.remove(user);
  }
}
