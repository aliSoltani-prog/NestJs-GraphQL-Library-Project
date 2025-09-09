import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { CreateProfileInput } from 'src/profile/dto/create-profile.input';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userrepo:Repository<User> ,
 @InjectRepository(Profile)private readonly profilerepo: Repository<Profile>,){}

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


    async createUserWithProfile(userInput: CreateUserInput, profileInput: CreateProfileInput) {
    const user = this.userrepo.create(userInput);
    await this.userrepo.save(user);

    const profile = this.profilerepo.create({ ...profileInput, user });
    await this.profilerepo.save(profile);

    return { ...user, profile };
  }


  async updateUserWithProfile(
  userId: number,
  userInput: UpdateUserInput,
  profileInput?: CreateProfileInput, // optional
) {
  // 1️⃣ Find the existing user along with the profile
  const user = await this.userrepo.findOne({
    where: { id: userId },
    relations: ['profile'], // load profile relation
  });

  if (!user) {
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  // 2️⃣ Check for duplicate email/username
  if (userInput.email) {
    const duplicateEmail = await this.userrepo.findOne({
      where: { email: userInput.email },
    });
    if (duplicateEmail && duplicateEmail.id !== userId) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }
  }

  if (userInput.username) {
    const duplicateUsername = await this.userrepo.findOne({
      where: { username: userInput.username },
    });
    if (duplicateUsername && duplicateUsername.id !== userId) {
      throw new HttpException('Username already in use', HttpStatus.BAD_REQUEST);
    }
  }

  // 3️⃣ Update user fields
  Object.assign(user, userInput);

  // 4️⃣ Handle profile update or creation
  if (profileInput) {
    let profile;
    if (user.profile) {
      // Profile exists → update it
      Object.assign(user.profile, profileInput);
      profile = await this.profilerepo.save(user.profile);
    } else {
      // No profile → create new one
      profile = this.profilerepo.create({ ...profileInput, user });
      await this.profilerepo.save(profile);
      user.profile = profile;
    }
  }

  // 5️⃣ Save user
  await this.userrepo.save(user);

  return user;
}

}
