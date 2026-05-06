import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    UserModule,
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importante: importar para poder injetar
      inject: [ConfigService], // Injeta o cara que já validamos com Joi
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>('JWT_SECRET');
        const expiresIn = config.get<string>('JWT_EXPIRATION') || '1d';
        return {
          secret: secret,
          signOptions: {
            // Pegando do seu Joi/ConfigService
            expiresIn: expiresIn as SignOptions['expiresIn'],
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
