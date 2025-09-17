import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { GqlThrottlerGuard } from 'src/guards/costum-guard/costum-guard.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles-guard/roles-guard.guard';
import { RoleDeco } from 'src/decorators/rolesdecorator/rolesdecorator.decorator';
import { Roles } from 'src/users/entities/user.entity';

@UseGuards(RolesGuard)
@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}


  @RoleDeco(Roles.Admin)
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => Author)
  async createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput) {
    return this.authorsService.create(createAuthorInput);
  }

  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @UseGuards(GqlThrottlerGuard)
  @Query(() => [Author], { name: 'authors' })
  async findAll() {
    return this.authorsService.findAll();
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Query(() => Author, { name: 'author' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOne(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => Author)
  async updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput) {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => Author)
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.remove(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Query(() => Author, { name: 'authorByName' })
  async findAuthorByName(@Args('name') name: string) {
    return this.authorsService.findAuthorByName(name);
  }
}
