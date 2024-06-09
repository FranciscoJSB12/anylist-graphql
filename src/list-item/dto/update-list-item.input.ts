import { IsUUID } from 'class-validator';
import { CreateListItemInput } from './create-list-item.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListItemInput extends PartialType(CreateListItemInput) {
  
  @Field(() => String)
  @IsUUID()
  id: string;
}
