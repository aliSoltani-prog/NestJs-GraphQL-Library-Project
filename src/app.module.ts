import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { Author } from './authors/entities/author.entity';
import { User } from './users/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { LoggerMiddleware } from './middlewares/logger/logger.middleware';

@Module({
  imports: [BooksModule , TypeOrmModule.forRoot({
    type : 'mysql' ,
    host : 'localhost',
    port : 3306 ,
    username : "aliSoltani" ,
    password : "mysql",
    database : "graphql_librarydb",
    entities: [Book , Author , User , Profile],
    synchronize : true
  }) , GraphQLModule.forRoot<ApolloDriverConfig>({
    driver : ApolloDriver, 
    autoSchemaFile : "src/schema.gql"
  }), AuthorsModule, UsersModule, ProfileModule  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
