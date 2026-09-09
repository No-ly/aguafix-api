import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validacion global para todos los DTOs:
  //  whitelist            -> borra propiedades no declaradas en el DTO
  //  forbidNonWhitelisted -> ademas, responde 400 si llegan propiedades de mas
  //  transform            -> instancia el DTO y castea tipos primitivos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(envs.PORT);
  console.log(`API escuchando en http://localhost:${envs.PORT}`);
}
void bootstrap();
