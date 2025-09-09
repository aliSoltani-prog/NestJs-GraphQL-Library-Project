import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ProfileService {
  constructor(@InjectRepository(Profile) private readonly profilerepo:Repository<Profile>){}

  async create(createProfileInput: CreateProfileInput) {
  const isDuplicateNumber = await this.profilerepo.findOneBy({phoneNumber : createProfileInput.phoneNumber})
  if (isDuplicateNumber){throw new HttpException("Phone Number already in use",HttpStatus.BAD_REQUEST)}
  const newProfile = this.profilerepo.create(createProfileInput)
  return this.profilerepo.save(newProfile)
  }

  //findAll() {
  //  return this.profilerepo.find();
  //}

  //async findOne(id: number) {
  //  const isExist = await this.profilerepo.findOneBy({id})
  //  if(!isExist) {throw new HttpException("user did not found",HttpStatus.BAD_REQUEST)}
  //  return isExist
  //}

  async update(id: number, updateProfileInput: UpdateProfileInput) {
    const isExist = await this.profilerepo.findOneBy({id : updateProfileInput.id})
    if(!isExist) {throw new HttpException("Profile did not found",HttpStatus.BAD_REQUEST)}
    if (updateProfileInput.phoneNumber) {
    const duplicateEmail = await this.profilerepo.findOne({
      where: { phoneNumber : updateProfileInput.phoneNumber },
    });
    if (duplicateEmail && duplicateEmail.id !== id) {
      throw new HttpException(
        'Phone Number already in use',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
    Object.assign(isExist, updateProfileInput);
    return this.profilerepo.save(isExist);
  }

  //async remove(id: number) {
  //  const isExist = await this.profilerepo.findOneBy({id})
  //  if(!isExist) {throw new HttpException("user did not found",HttpStatus.BAD_REQUEST)}
  //  await this.profilerepo.delete(id)
  //  return isExist
  //}
}

