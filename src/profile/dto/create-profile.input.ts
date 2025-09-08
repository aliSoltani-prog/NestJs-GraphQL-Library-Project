import { InputType, Int, Field, GraphQLISODateTime } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


@InputType()
export class CreateProfileInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstname : string

  @Field()
  @IsString()
  @IsNotEmpty()
  lastname : string

  @Field()
  @IsString()
  @IsNotEmpty()
  phoneNumber : string

  @Field(() => GraphQLISODateTime)
  @IsNotEmpty()
  dateOfbirth : Date

}