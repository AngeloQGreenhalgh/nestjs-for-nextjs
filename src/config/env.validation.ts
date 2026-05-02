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
});

// Aqui fica a TRATATIVA de erro genérica
export function validateEnv(config: Record<string, any>) {
  const { error, value } = envSchema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    console.error('\n❌ --- ERRO DE CONFIGURAÇÃO ---');
    error.details.forEach(detail => {
      console.error(` • ${detail.message}`);
    });
    console.error('-------------------------------\n');

    // Em vez de throw new Error(...), usamos:
    process.exit(1);
  }

  return value;
}
