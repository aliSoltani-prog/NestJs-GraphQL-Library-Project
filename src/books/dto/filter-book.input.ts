import { InputType, Field } from '@nestjs/graphql';
import { Language, Genre } from '../entities/book.entity';

@InputType()
export class BookFilterInput {
  @Field(() => Language, { nullable: true })
  language?: Language;

  @Field(() => Genre, { nullable: true })
  genre?: Genre;
}