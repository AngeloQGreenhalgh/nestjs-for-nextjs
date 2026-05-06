import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.validation';
import { UploadModule } from './upload/upload.module';

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
            // Essa opção é ruim pois não aplica mudanças imediatamente no banco de dados
            autoLoadEntities:
              config.get<string>('DB_AUTO_LOAD_ENTITIES') === '1',
            //entities: [User, Post], // Uso de Autoload Entities
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

    UploadModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
