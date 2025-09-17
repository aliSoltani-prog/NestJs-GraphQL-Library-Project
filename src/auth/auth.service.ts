import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
   constructor(
    @InjectRepository(User)
    private readonly userrepo: Repository<User>,

  ) {}
  // create(createAuthInput: CreateAuthInput) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthInput: UpdateAuthInput) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
  async login(username: string, password: string) {
  // 🔎 find user only by username
  const user = await this.userrepo.findOne({ where: { username } });

  if (!user) {
    throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
  }

  // ✅ compare entered password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
  }

  // 🎉 login successful
  return {
    message: 'Login successful',
    user,
  };
}

}
