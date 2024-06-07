import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //MUCHO OJO: para que las validaciones de los dto (input) en estos casos  hay que aplicar el app.useGlobalPipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  
  await app.listen(3000);
}
bootstrap();
