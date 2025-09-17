import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateAuthInput } from './dto/create-auth.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // Login mutation
  @Mutation(() => User)
  async login(@Args('loginInput') loginInput: CreateAuthInput): Promise<User> {
    const { username, password } = loginInput;
    const result = await this.authService.login(username, password);

    // Return only the user object, without the message
    return result.user;
  }
}
