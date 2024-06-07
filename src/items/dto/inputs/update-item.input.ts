import { IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsUUID()
  //Puedes tener el campo field, pero sin la validación del class validator falla porque no se le está indicando que lo espere
  id: string;
}
