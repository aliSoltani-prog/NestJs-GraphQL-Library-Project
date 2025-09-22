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
  @Mutation(() => User , {description : `requirements :
     query : 
mutation CreateUser{
  createUser(createUserInput: {
    username: "ali"
    email: "ali@example.com"
    password: "123456"
    role: Admin
  }) {
    id
    username
    email
    role
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Query(() => [User], { name: 'users' , description : `requirements :
     query : 
query FetchAllTheUsers{
  users {
    id
    username
    email
    role
    profile {
      id
      firstname
      lastname
      phoneNumber
      dateOfbirth
    }
  }
}
    header : 
    x-user-role : Admin || User || Guest
`})
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Query(() => User, { name: 'user' , description : `requirements :
     query : 
query FetchOneUserWithSpecifiedID{
  user(id: 5) {
    id
    username
    email
    role
    profile {
      id
      firstname
      lastname
      phoneNumber
      dateOfbirth
    }
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => User , { description : `requirements :
     query : 
mutation UpdateUser{
  updateUser(updateUserInput: {
    id: 5
    username: "newAli"
    email: "ali.new@example.com"
  }) {
    id
    username
    email
    role
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => User , {description : `requirements :
     query : 
mutation DeleteUser{
  removeUser(id: 1) {
    id
    username
    email
  }
}
    header : 
    x-user-role : Admin || User || Guest
`})
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => User , {description : `requirements :
     query : 
mutation CreateProfileAndUser{
  createUserWithProfile(
    userInput: {
      username: "newUser"
      email: "newuser@example.com"
      password: "123456"
      role: Guest
    }
    profileInput: {
      firstname: "New"
      lastname: "User"
      phoneNumber: "123123123"
      dateOfbirth: "2002-06-15T00:00:00.000Z"
    }
  ) {
    id
    username
    email
    role
    profile {
      id
      firstname
      lastname
      phoneNumber
      dateOfbirth
    }
  }
}
    header : 
    x-user-role : Admin || User || Guest
`})
  createUserWithProfile(
    @Args('userInput') userInput: CreateUserInput,
    @Args('profileInput') profileInput: CreateProfileInput,
  ) {
    return this.usersService.createUserWithProfile(userInput, profileInput);
  }

  // 🟢 Create Profile for Existing User
  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => Profile , {description : `requirements :
     query : 
mutation CreateProfileWithExistingUser{
  createProfile(
    userId: 2
    createProfileInput: {
      firstname: "Ali"
      lastname: "Soltani"
      phoneNumber: "123456789"
      dateOfbirth: "2000-05-20T00:00:00.000Z"
    }
  ) {
    id
    firstname
    lastname
    phoneNumber
    dateOfbirth
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async createProfile(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('createProfileInput') createProfileInput: CreateProfileInput, // name must match
  ) {
    return this.usersService.createProfile(userId, createProfileInput);
  }

  // 🟢 Update Profile
  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Mutation(() => Profile , {description : `requirements :
     query : 
mutation UpdateProfile{
  updateProfile(
    profileId: 1
    updateProfileInput: {
      firstname: "Updated"
      lastname: "User"
      phoneNumber: "987654321"
      dateOfbirth: "2001-01-01T00:00:00.000Z"
    }
  ) {
    id
    firstname
    lastname
    phoneNumber
    dateOfbirth
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  updateProfile(
    @Args('profileId', { type: () => Int }) profileId: number,
    @Args('updateProfileInput') updateProfileInput: CreateProfileInput,
  ) {
    return this.usersService.updateProfile(profileId, updateProfileInput);
  }
}
