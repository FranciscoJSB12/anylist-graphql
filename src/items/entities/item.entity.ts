import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
//El decorador entity no viene por defecto, pero es necesario aplicarlo
@ObjectType()
//Un dato muy importante es que el nombre que se le da a clase, el cual es Item en este caso viene siendo el nombre que tendrá en la base de datos
export class Item {
  //El decorador field es lo que le dice a graphql que el objeto va a tener una propiedad llamada id, por ejemplo.
  //@Field(() => Int, { description: 'Example field (placeholder)' })

  @PrimaryGeneratedColumn('uuid') //PrimaryGeneratedColumn es para postgres, el tipado que necesita postgres
  @Field(() => ID) // Field es para graphql que necesita un tipo específicado
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => Float)
  quantity: number;

  @Column()
  @Field(() => String)
  quantityUnits: string;
}

//IMPORTANTE: luego de declara la entidad, que es cómo será la tabla en la base de datos, vamos al module (items.module) en este caso y lo importamos como se hizo, con esto ya se establece la tabla
