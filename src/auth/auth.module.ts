import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
  //Se exportan el passportmodule y el jwtmodule ya que nos servirán para verificar usuarios
  //Revisar el archivo jwt.strategy para entender el porqué de jwtstrategy en esa posición
  imports: [
    ConfigModule,
    //config module es para leer las variables de entorno, no hace falta forRoot
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      //importamos el config module es para tener acceso al modulo de configuración donde están las variables de entorno
      inject: [ConfigService],
      //también necesitamos inyectar al configservice para poder usar el usefactory y así definir de forma asincrona la creación del modulo
      useFactory: (configservice: ConfigService) => {
        return {
          secret: configservice.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h'
          }
        }
      }
    }),
    //jwtmodule.registerasync se asegura de que las variables de entorno ya estén cargadas y leídas
    UsersModule,
    //aplicamos aquí la importación para poder usar el usersService
  ]
})
export class AuthModule {}
