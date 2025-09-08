import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  username : string
  
  @Field(() => Roles,{defaultValue:Roles.Guest})
  @IsOptional()
  role? : Roles
  
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email : string

  @Field()
  @IsString()
  @IsNotEmpty()
  password : string
  
}
