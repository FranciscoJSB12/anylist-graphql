import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //MUCHO OJO: para que las validaciones de los dto (input) en estos casos  hay que aplicar el app.useGlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false
      //forbidNonWhitelisted: false si se estuviera trabajando con una rest api sería util ternerlo en true para evitar que nos manden más información de la que se espera, en este caso graphql lo hace por nosotros, por lo que no hace falta
    })
  );
  
  await app.listen(3000);
}
bootstrap();
