import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([ User ])
  ],
  exports: [
    //TypeOrmModule,
    //Exportamos el TypeOrmModule en caso de alguien necesite el users.entity o inyectar el usersRepository
    UsersService
    //Al hacer la exportación del UsersService toca irse al auth.module para hacer la importación
  ]
})
export class UsersModule {}
