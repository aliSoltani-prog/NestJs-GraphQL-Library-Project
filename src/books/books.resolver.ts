import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles-guard/roles-guard.guard';
import { RoleDeco } from 'src/decorators/rolesdecorator/rolesdecorator.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { GqlThrottlerGuard } from 'src/guards/costum-guard/costum-guard.guard';
import { BookFilterInput } from './dto/filter-book.input';

@UseGuards(RolesGuard)
@Resolver(() => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => Book ,{ description : `requirements :
     query : 
mutation CreateBook{
  createBook(createBookInput: {
    title: "The Great Adventure"
    authorId : 2
    translator: "John Doe"
    edition: 2
    publisher: "ABC Publishing"
    language: Persian  
    genre: Adventure   
  }) {
    id
    title
    translator
    edition
    publisher
    language
    genre
    author {
      id
      name
    }
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
@Query(() => [Book], { name: 'books'  , description : `requirements :
     query : 
query FetchAllTheBooks{
  books {
    id
    title
    translator
    edition
    publisher
    language
    genre
    author {
      id
      name
    }
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
async findAll(@Args('filter', { nullable: true }) filter?: BookFilterInput) {
  return this.booksService.findAll(filter);
}


  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Query(() => Book, { name: 'book' , description : `requirements :
     query : 
query FetchOneBookWithSpecifiedID{
  book(id: 1) {
    id
    title
    translator
    edition
    publisher
    language
    genre
    author {
      id
      name
    }
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOne(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => Book , {description : `requirements :
     query : 
mutation UpdateBook{
  updateBook(updateBookInput: {
    id: 3
    title: "The Greatest Adventure"
    translator: "Jane Doe"
    edition: 3
    publisher: "XYZ Publishing"
    language: English
    genre: Adventure
  }) {
    id
    title
    translator
    edition
    publisher
    language
    genre
    author {
  id
  name
}
  }
}

    header : 
    x-user-role : Admin || User || Guest
`})
  async updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin)
  @Mutation(() => Book , {description : `requirements :
     query : 
mutation DeleteBook{
  removeBook(id: 1) {
    id
    title
  }
}
    header : 
    x-user-role : Admin || User || Guest
`})
  async removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.remove(id);
  }

  @UseGuards(GqlThrottlerGuard)
  @RoleDeco(Roles.Admin , Roles.Guest , Roles.User)
  @Query(() => Book, { name: 'findBookByTitle' , description : `requirements :
     query : 
query SearchForBook{
  findBookByTitle(title: "The Great Adventure") {
    id
    title
    edition
    publisher
    author {
      id
      name
    }
  }
}
    header : 
    x-user-role : Admin || User || Guest
`})
  async findBookByTitle(@Args('title', { type: () => String }) title: string) {
    return this.booksService.findBookByTitle(title);
  }
}
