import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateAuthorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @Field(() => Date)
  @IsNotEmpty()
  dateOfBirth: Date;
  
  @Field({nullable : true})
  @IsNotEmpty()
  @IsString()
  nationality: string;
  
}
