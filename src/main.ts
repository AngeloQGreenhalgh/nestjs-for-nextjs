import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3001;
  const corsWhitelist = configService.get<string>('CORS_WHITELIST') || '';
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

  // A rota do swagger está configurada para '/api'
  SwaggerModule.setup('api', app, document, {
    explorer: true, // Ativa a barra de busca/exploração superior
    swaggerOptions: {
      // Esta configuração faz o Swagger listar o arquivo de contrato na barra superior
      urls: [
        {
          url: '/api-json', // Rota que o NestJS gera automaticamente
          name: 'V1 - Contrato JSON',
        },
        {
          url: '/api-yaml', // Rota que o NestJS gera automaticamente
          name: 'V1 - Contrato YAML',
        },
      ],
    },
    customSiteTitle: 'Documentação API - Ângelo',
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );
  const corsWhiteList = parseCorsWhitelist(corsWhitelist);

  app.enableCors({
    origin: (
      origin: string | undefined, // Isso é do navegado para proteger o cliente
      callback: (...args: any[]) => void,
    ) => {
      // Requisição sem origin ou que inclui uma origin conhecida
      // por corsWhitelist é permitida
      if (!origin || corsWhiteList.includes(origin)) {
        return callback(null, true);
      }

      // Requisições com Origin desconhecida negamos
      return callback(new Error('Not allowed by CORS'), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades não definidas
      transform: false, // Transforma os tipos de acordo com os DTOs
    }),
  ); // Habilita validação global

  await app.listen(port);
}
void bootstrap();
