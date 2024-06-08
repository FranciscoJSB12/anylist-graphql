import { ObjectType, ID, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column() // Importante: si no se específica que es nulo, el campo será obligatorio
  @Field(() => String)
  fullName: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column()
  //Como no queremos permitir consultas sobre la contraseña omitimos el decorador field
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @Field(() => [String])
  roles: string[];


  @Column({
    type: 'boolean',
    default: true
  })
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateBy, { nullable: true, lazy: true })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { nullable: true })
  //1. Decimos que regresa user () => User
  //2. Establecemos cómo se relaciona (user) => user.lastUpdateBy
  //3. Como la relación al inicio es nula marcamos el campo nullable en true
  //4. Hace falta añadir el @JoinColumn() porque se necesita que siempre esté ahí y también cuando se hagan consultas podemos saber que hay una relación ahí para que typeorm cargue la información
  //5. Falta añadir un @Field() ya que con lo descrito typeorm puede trabajar, pero Graphql no. Indicamos el tipo de dato a regresar con () => User en el Field y como puede ser nulo decimos nullable: true
  //6. Aplicamos lazy: true para que cargue por defecto la relación, no se usa eager porque tenemos el querybuilder
  lastUpdateBy?: User;
}
