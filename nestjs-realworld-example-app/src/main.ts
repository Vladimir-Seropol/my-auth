// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, { cors: true });
  app.setGlobalPrefix('api');

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
  console.log('Server running at http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/docs');
}

bootstrap();