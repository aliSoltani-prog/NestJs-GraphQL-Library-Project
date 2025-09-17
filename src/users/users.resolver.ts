import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Roles, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateProfileInput } from 'src/profile/dto/create-profile.input';
import { Profile } from 'src/profile/entities/profile.entity';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles-guard/roles-guard.guard';
import { RoleDeco } from 'src/decorators/rolesdecorator/rolesdecorator.decorator';
import { GqlThrottlerGuard } from 'src/guards/costum-guard/costum-guard.guard';

@UseGuards(RolesGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User) // only Admin can access
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => User)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => User)
  createUserWithProfile(
    @Args('userInput') userInput: CreateUserInput,
    @Args('profileInput') profileInput: CreateProfileInput,
  ) {
    return this.usersService.createUserWithProfile(userInput, profileInput);
  }

  // 🟢 Create Profile for Existing User
  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => Profile)
  async createProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('createProfileInput') createProfileInput: CreateProfileInput, // name must match
  ) {
    return this.usersService.createProfile(userId, createProfileInput);
  }

  // 🟢 Update Profile
  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => Profile)
  updateProfile(
    @Args('profileId', { type: () => Int }) profileId: number,
    @Args('updateProfileInput') updateProfileInput: CreateProfileInput,
  ) {
    return this.usersService.updateProfile(profileId, updateProfileInput);
  }
}
