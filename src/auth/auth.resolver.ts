import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UseGuards } from '@nestjs/common';
import { GqlThrottlerGuard } from 'src/guards/costum-guard/costum-guard.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => User , {description : `requirements :
     query : 
     mutation Login{
  login(loginInput: { 
    username: "ali", 
    password: "123456" 
  }) {
    id
    username
    email
  }
}`})
  async login(@Args('loginInput') loginInput: CreateAuthInput): Promise<User> {
    const { username, password } = loginInput;
    const result = await this.authService.login(username, password);

    // Return only the user object, without the message
    return result.user;
  }
}
