import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private readonly authorsService: AuthorsService) {}

  @Mutation(() => Author)
  async createAuthor(@Args('createAuthorInput') createAuthorInput: CreateAuthorInput) {
    return this.authorsService.create(createAuthorInput);
  }

  @Query(() => [Author], { name: 'authors' })
  async findAll() {
    return this.authorsService.findAll();
  }

  @Query(() => Author, { name: 'author' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOne(id);
  }

  @Mutation(() => Author)
  async updateAuthor(@Args('updateAuthorInput') updateAuthorInput: UpdateAuthorInput) {
    return this.authorsService.update(updateAuthorInput.id, updateAuthorInput);
  }

  @Mutation(() => Author)
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.remove(id);
  }

  @Query(() => Author, { name: 'authorByName' })
  async findAuthorByName(@Args('name') name: string) {
    return this.authorsService.findAuthorByName(name);
  }
}
