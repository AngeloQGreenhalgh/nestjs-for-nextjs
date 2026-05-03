import { InternalServerErrorException } from '@nestjs/common';
import * as Joi from 'joi';

// Aqui ficam as REGRAS que você já tinha definido
export const envSchema = Joi.object({
  DB_TYPE: Joi.string()
    .valid('better-sqlite3', 'postgres')
    .default('better-sqlite3'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_PASSWORD: Joi.string().when('DB_TYPE', {
    is: 'postgres',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  DB_DATABASE: Joi.string().default('./db.sqlite'),
  DB_SYNCHRONIZE: Joi.string().valid('0', '1').default('0'),
  DB_AUTO_LOAD_ENTITIES: Joi.string().valid('0', '1').default('0'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
});

// Aqui fica a TRATATIVA de erro genérica
export function validateEnv(config: Record<string, any>) {
  const { error, value } = envSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    // 1. Procuramos se algum dos erros é relacionado ao JWT
    const isJwtError = error.details.some(
      detail =>
        detail.path.includes('JWT_SECRET') ||
        detail.path.includes('JWT_EXPIRATION'),
    );

    // 2. Mostramos o log decorado (que você gostou)
    console.error('\n❌ --- ERRO DE CONFIGURAÇÃO ---');
    error.details.forEach(detail => {
      console.error(` • ${detail.message}`);
    });
    console.error('-------------------------------\n');

    // 3. Se for erro de JWT, lançamos a Exception
    if (isJwtError) {
      throw new InternalServerErrorException(
        'Configuração do JWT inválida no .env',
      );
    }

    // 4. Para os demais casos (Banco, etc), apenas paramos o app de forma limpa
    process.exit(1);
  }

  return value;
}
