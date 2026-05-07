import { InternalServerErrorException } from '@nestjs/common';
import * as Joi from 'joi';

// Mantemos o seu schema como está
export const envSchema = Joi.object({
  APP_PORT: Joi.number().default(3001),
  CORS_WHITELIST: Joi.string().default('*'),
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

export function validateEnv(config: Record<string, unknown>) {
  // AJUSTE AQUI: Forçamos o tipo do retorno do Joi para evitar o 'any'
  const { error, value } = envSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  }) as { error?: Joi.ValidationError; value: Record<string, unknown> };

  if (error) {
    const isJwtError = error.details.some(
      detail =>
        detail.path.includes('JWT_SECRET') ||
        detail.path.includes('JWT_EXPIRATION'),
    );

    console.error('\n❌ --- ERRO DE CONFIGURAÇÃO ---');
    error.details.forEach(detail => {
      console.error(` • ${detail.message}`);
    });
    console.error('-------------------------------\n');

    if (isJwtError) {
      throw new InternalServerErrorException(
        'Configuração do JWT inválida no .env',
      );
    }

    process.exit(1);
  }

  // Agora o retorno é tratado como um Record seguro, não como any
  return value;
}
