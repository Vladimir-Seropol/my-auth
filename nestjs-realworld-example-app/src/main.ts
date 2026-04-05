import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';

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

  // Создаём тестового пользователя
  const userService = app.get(UserService);
  const testEmail = 'test@example.com';
  const testPassword = '123456';
  const testUsername = 'testuser';

  // Удаляем старого пользователя, если есть
  const existingUser = await userService.findByEmail(testEmail);
  if (existingUser) {
    await userService.deleteUser(existingUser.id);
  }

  // Создаём нового тестового пользователя
  await userService.createUser({
    email: testEmail,
    password: testPassword,
    username: testUsername,
  });

  console.log(`Тестовый пользователь создан: ${testEmail} / ${testPassword}`);

  await app.listen(3000);
  console.log('Server running at http://localhost:3000');
  console.log('Swagger docs at http://localhost:3000/docs');
}

bootstrap();