import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { Author } from './entities/author.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Book , Author])],
  providers: [AuthorsResolver, AuthorsService],
  exports : [AuthorsService]
})
export class AuthorsModule {}
