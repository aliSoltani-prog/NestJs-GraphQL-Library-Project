import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userrepo:Repository<User>){}

  async create(createUserInput: CreateUserInput) {
    const isDuplicteEmail = await this.userrepo.findOneBy({email:createUserInput.email})
    const isDuplicteUsername = await this.userrepo.findOneBy({username : createUserInput.username})
    if(isDuplicteEmail){throw new HttpException("Email already in use",HttpStatus.BAD_REQUEST)}
    else if(isDuplicteUsername){throw new HttpException("username already in use",HttpStatus.BAD_REQUEST)}
    const newUser = this.userrepo.create(createUserInput)
    return this.userrepo.save(newUser)
  }

  findAll() {
    return this.userrepo.find();
  }

  async findOne(id: number) {
    const isExist = await this.userrepo.findOneBy({id})
    if(!isExist) {throw new HttpException("user did not found",HttpStatus.BAD_REQUEST)}
    return isExist
  }

  async update(id: number, updateUserInput: UpdateUserInput) {
    const isExist = await this.userrepo.findOneBy({id : updateUserInput.id})
    if(!isExist) {throw new HttpException("user did not found",HttpStatus.BAD_REQUEST)}
    if (updateUserInput.email) {
    const duplicateEmail = await this.userrepo.findOne({
      where: { email: updateUserInput.email },
    });
    if (duplicateEmail && duplicateEmail.id !== id) {
      throw new HttpException(
        'Email already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  if (updateUserInput.username) {
    const duplicateUsername = await this.userrepo.findOne({
      where: { username: updateUserInput.username },
    });
    if (duplicateUsername && duplicateUsername.id !== id) {
      throw new HttpException(
        'Username already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
    Object.assign(isExist, updateUserInput);
    return this.userrepo.save(isExist);
  }

  async remove(id: number) {
    const isExist = await this.userrepo.findOneBy({id})
    if(!isExist) {throw new HttpException("user did not found",HttpStatus.BAD_REQUEST)}
    await this.userrepo.delete(id)
    return isExist
  }
}
