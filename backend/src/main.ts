import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Permite que o front-end React (Vite) consuma a API

  // Ativa validação dos DTOs; whitelist descarta campos fora do DTO e transform converte datas
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Erros do Prisma (e-mail duplicado, FK inválida, ID inexistente) viram 409/400/404
  app.useGlobalFilters(new PrismaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Plataforma de Cursos API')
    .setDescription('Documentação da API com NestJS, Prisma e JWT')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('usuarios')
    .addBearerAuth( // Adiciona o campo de autenticação no Swagger
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/api`);
}
bootstrap();
