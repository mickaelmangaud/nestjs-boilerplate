import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(createdUser);
  }

  async findAll(limit: string): Promise<User[]> {
    return await this.usersRepository.find({ take: +limit || 0 });
  }

  findOne(id: number): string {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user ${JSON.stringify(updateUserDto)}`;
  }

  remove(id: number): string {
    return `This action removes a #${id} user`;
  }
}
