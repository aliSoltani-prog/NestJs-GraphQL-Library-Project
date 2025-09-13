import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly bookrepo:Repository<Book> ,
@InjectRepository(Author) private readonly authorrepo:Repository<Author>){}

  async create(createBookInput: CreateBookInput) {
  const newBook = this.bookrepo.create(createBookInput)
      if (createBookInput.authorId) {
      const author = await this.authorrepo.findOneBy({
        id: createBookInput.authorId,
      });
      if (!author) {
        throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
      }
      newBook.author = author; // 🔗 attach the relation
    }
  return this.bookrepo.save(newBook)
  }

  findAll() {
    return this.bookrepo.find({relations : ['author']});
  }

  async findOne(id: number) {
    const isExist = await this.bookrepo.findOne({ where : {id} , relations : ['author'] })
    if(!isExist) {throw new HttpException("Book did not found",HttpStatus.BAD_REQUEST)}
    return isExist
  }

async update(id: number, updateBookInput: UpdateBookInput) {
  const book = await this.bookrepo.findOne({
    where: { id },
    relations: ['author'], // make sure the current author is loaded
  });

  if (!book) {
    throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
  }

  // Update regular fields
  Object.assign(book, updateBookInput);

  // Handle author relation if authorId is provided
  if (updateBookInput.authorId) {
    const author = await this.authorrepo.findOneBy({ id: updateBookInput.authorId });
    if (!author) {
      throw new HttpException('Author not found', HttpStatus.BAD_REQUEST);
    }
    book.author = author;
  }

  return this.bookrepo.save(book);
  }

  async remove(id: number) {
    const isExist = await this.bookrepo.findOneBy({id})
    if(!isExist) {throw new HttpException("Book did not found",HttpStatus.BAD_REQUEST)}
    await this.bookrepo.delete(id)
    return isExist
  }

  async findBookByTitle(title: string) {
  const book = await this.bookrepo.findOne({
    where: { title },
    relations: ['author'], // include author relation
  });

  if (!book) {
    throw new HttpException('Book not found', HttpStatus.BAD_REQUEST);
  }

  return book;
}
}
