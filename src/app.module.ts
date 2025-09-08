import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entities/book.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthorsModule } from './authors/authors.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [BooksModule , TypeOrmModule.forRoot({
    type : 'mysql' ,
    host : 'loalhost',
    port : 3306 ,
    username : "aliSoltani" ,
    password : "mysql",
    database : "graphql-librarydb",
    entities: [Book],
    synchronize : true
  }) , GraphQLModule.forRoot<ApolloDriverConfig>({
    driver : ApolloDriver, 
    autoSchemaFile : "src/schema.gql"
  }), AuthorsModule, UsersModule, ProfileModule  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
