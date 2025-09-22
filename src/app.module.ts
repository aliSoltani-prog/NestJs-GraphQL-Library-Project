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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { GqlThrottlerGuard } from './guards/costum-guard/costum-guard.guard';
import { AuthModule } from './auth/auth.module';
import { express as graphqlVoyagerMiddleware } from 'graphql-voyager/middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 30000, limit: 30 }],
    }),
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'aliSoltani',
      password: 'mysql',
      database: 'graphql_librarydb',
      entities: [Book, Author, User, Profile],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      context: ({ req, res }) => {
        // 👇 Extract role from headers and attach to req.user
        const role = req.headers['x-user-role'] || 'guest';

        req.user = {
          role: role,
        };

        return { req, res };
      },
      playground: true, // make sure playground is ON
      introspection: true, // allow schema docs
    }),
    AuthorsModule,
    UsersModule,
    ProfileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GqlThrottlerGuard,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    // 👉 add voyager route (only in dev, optional)
    if (process.env.NODE_ENV !== 'production') {
      consumer
        .apply(graphqlVoyagerMiddleware({ endpointUrl: '/graphql' }))
        .forRoutes('/voyager');
    }
  }
}
