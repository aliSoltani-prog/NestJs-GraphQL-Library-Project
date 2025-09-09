import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private readonly bookrepo:Repository<Book>){}

  create(createBookInput: CreateBookInput) {
  const newBook = this.bookrepo.create(createBookInput)
  return this.bookrepo.save(newBook)
  }

  findAll() {
    return this.bookrepo.find();
  }

  async findOne(id: number) {
    const isExist = await this.bookrepo.findOneBy({id})
    if(!isExist) {throw new HttpException("Book did not found",HttpStatus.BAD_REQUEST)}
    return isExist
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const isExist = await this.bookrepo.findOneBy({id : updateBookInput.id})
    if(!isExist) {throw new HttpException("Book did not found",HttpStatus.BAD_REQUEST)}
    Object.assign(isExist, updateBookInput);
    return this.bookrepo.save(isExist);
  }

  async remove(id: number) {
    const isExist = await this.bookrepo.findOneBy({id})
    if(!isExist) {throw new HttpException("Book did not found",HttpStatus.BAD_REQUEST)}
    await this.bookrepo.delete(id)
    return isExist
  }
}
