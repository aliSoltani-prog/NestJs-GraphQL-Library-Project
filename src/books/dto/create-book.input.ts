import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Genre, Language } from '../entities/book.entity';

@InputType()
export class CreateBookInput {

  @Field()
  @IsString()
  @IsNotEmpty()
  title : string

  @Field(() => Int, { nullable: true })
  @IsOptional()
  authorId?: number;

  @Field({nullable : true})
  @IsString()
  @IsOptional()
  translator? : string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  edition: number;

  @Field()
  @IsString()
  publisher: string;

  @Field(() => Language, {defaultValue : Language.Persian})
  @IsOptional()
  language? :Language

  @Field(() => Genre , {defaultValue : Genre.Adventure})
  @IsOptional()
  genre? : Genre;
}
