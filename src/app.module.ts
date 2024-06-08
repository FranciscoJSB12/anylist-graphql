import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
      ConfigModule.forRoot(),
      GraphQLModule.forRootAsync({
        driver: ApolloDriver,
        imports: [AuthModule],
        inject: [JwtService],
        useFactory: async (jwtService: JwtService) => {
          return {
            playground: false,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            plugins: [
              ApolloServerPluginLandingPageLocalDefault()
            ],
            context({ req }) {
              //const token = req.headers.authorization?.replace('Bearer ','');
         
              //const payload = jwtService.decode(token);
              
              //if(!token) throw Error('Token needed');

              //if (!payload) throw Error('Token not valid');

              //IMPORTANTE LEER
              //1. Extraemos el token de la request, ahora usamos el modulo de auth en los imports de esta forma el root async tiene acceso a todo lo que ese modulo ofrece.
              //2. Hay que inyectar el servicio que ofrece el auth module, lo hacemos con JwtService
              //3. En la función del useFactory pasamos ese. JwtService, el paso anterior es para poder hacer esta inyección.
            }
          }
        }
      }),
      /*
      GraphQLModule.forRoot<ApolloDriverConfig> usar es válido y funciona sin problemas, el detalle está en que no se está protegiendo el endpoint
      GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),*/
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
      ItemsModule,
      UsersModule,
      AuthModule,
      SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
