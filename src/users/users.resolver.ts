import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateProfileInput } from 'src/profile/dto/create-profile.input';
import { Profile } from 'src/profile/entities/profile.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
  @Mutation(() => User)
  createUserWithProfile(
    @Args('userInput') userInput: CreateUserInput,
    @Args('profileInput') profileInput: CreateProfileInput,
  ) {
    return this.usersService.createUserWithProfile(userInput, profileInput);
  }

  // 🟢 Create Profile for Existing User
  @Mutation(() => Profile)
  async createProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('createProfileInput') createProfileInput: CreateProfileInput, // name must match
  ) {
    return this.usersService.createProfile(userId, createProfileInput);
  }

  // 🟢 Update Profile
  @Mutation(() => Profile)
  updateProfile(
    @Args('profileId', { type: () => Int }) profileId: number,
    @Args('updateProfileInput') updateProfileInput: CreateProfileInput,
  ) {
    return this.usersService.updateProfile(profileId, updateProfileInput);
  }
}
