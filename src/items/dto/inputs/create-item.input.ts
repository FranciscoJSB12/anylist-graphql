import { InputType, Float, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
//El inputtype es lo que le dice a graphql qué campos son permitidos
export class CreateItemInput {

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  //@Field(() => Float)
  //@IsPositive()
  //quantity: number;

  @Field(() => String, { nullable: true }) // los decoradores field controlan como viene la data en graphql y si puede haber campos nulos
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
