import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from 'src/profile/entities/profile.entity';
import { CreateProfileInput } from 'src/profile/dto/create-profile.input';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userrepo:Repository<User> ,
 @InjectRepository(Profile)private readonly profilerepo: Repository<Profile>,){}

  async create(createUserInput: CreateUserInput) {
    const isDuplicteEmail = await this.userrepo.findOneBy({
      email: createUserInput.email,
    });
    const isDuplicteUsername = await this.userrepo.findOneBy({
      username: createUserInput.username,
    });

    if (isDuplicteEmail) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    } else if (isDuplicteUsername) {
      throw new HttpException(
        'username already in use',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 🔑 hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      saltRounds,
    );

    const newUser = this.userrepo.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return this.userrepo.save(newUser);
  }

  findAll() {
    return this.userrepo.find({relations : ['profile']});
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userrepo.findOne({ where: { id }, relations: ['profile'] });
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
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


    async createUserWithProfile(userInput: CreateUserInput, profileInput: CreateProfileInput) {
  // 🔒 Hash the password before saving
  const hashedPassword = await bcrypt.hash(userInput.password, 10);

  // Create user with hashed password
  const user = this.userrepo.create({
    ...userInput,
    password: hashedPassword,
  });
  await this.userrepo.save(user);

  // Create profile linked to the user
  const profile = this.profilerepo.create({ ...profileInput, user });
  await this.profilerepo.save(profile);

  // Return combined user + profile
  return { ...user, profile };
}

  async createProfile(userId: number, profileInput: CreateProfileInput) {
  // 1️⃣ Check if user exists
  const user = await this.userrepo.findOne({
    where: { id: userId },
    relations: ['profile'],
  });
  if (!user) {
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  // 2️⃣ Check if user already has a profile
  if (user.profile) {
    throw new HttpException(
      'User already has a profile. Use update instead.',
      HttpStatus.BAD_REQUEST,
    );
  }

  // 3️⃣ Create and link profile
  const profile = this.profilerepo.create({ ...profileInput, user });
  await this.profilerepo.save(profile);

  return profile;
}
async updateProfile(profileId: number, profileInput: CreateProfileInput) {
  const profile = await this.profilerepo.findOneBy({ id: profileId });
  if (!profile) {
    throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
  }

  Object.assign(profile, profileInput);
  return this.profilerepo.save(profile);
}


}
