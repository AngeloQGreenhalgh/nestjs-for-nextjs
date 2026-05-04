import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        if (config.get<string>('DB_TYPE') === 'better-sqlite3') {
          return {
            type: 'better-sqlite3',
            database: config.get<string>('DB_DATABASE'),
            synchronize: config.get<string>('DB_SYNCHRONIZE') === '1',
            autoLoadEntities:
              config.get<string>('DB_AUTO_LOAD_ENTITIES') === '1',
          };
        }

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          synchronize: config.get<string>('DB_SYNCHRONIZE') === '1',
          autoLoadEntities: config.get<string>('DB_AUTO_LOAD_ENTITIES') === '1',
        };
      },
    }),
  ],
  // controllers: [AppController],
  // providers: [AppService],
  exports: [],
})
export class AppModule {}
