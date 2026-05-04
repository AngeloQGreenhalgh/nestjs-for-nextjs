import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Minha API NestJS')
    .setDescription('Descrição da API para meu projeto de estudo')
    .setVersion('1.0')
    // Adiciona a definição do esquema de segurança
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Opcional, apenas para documentação
        name: 'JWT',
        description: 'Insira o token JWT',
        in: 'header',
      },
      'token', // Este é o nome da referência (key) que usaremos nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Define a rota /api

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades não definidas
      transform: false, // Transforma os tipos de acordo com os DTOs
    }),
  ); // Habilita validação global

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
