import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

  //@Column()
  //@Field(() => Float)
  //quantity: number;

  @Column({ nullable: true }) // es importante permitir nulos en la base de datos
  @Field(() => String, { nullable: true }) // aquí estamos permitiendo nulos en graphql
  quantityUnits?: string;

  //1. En este punto aplicamos una relación entre usuarios e items escribiendo el decorador ManyToOne
  //2. Relacionamos el item con el usuario con () => User
  //3. Sigue establecer el campo que se va a establecer para la relación
  //4. Eso sería todo en cuanto a TypeOrm, sigue establecerlo para graphql con @Field(() => User) 
  @ManyToOne(() => User, (user) => user.items)
  @Field(() => User)
  user: User;
}

//IMPORTANTE: luego de declarar la entidad, que es cómo será la tabla en la base de datos, vamos al module (items.module) en este caso y lo importamos como se hizo, con esto ya se establece la tabla
