import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-parse.pipe';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request';
@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', CustomParseIntPipe)
    id: number,
  ): string {
    console.log(req.user.id);
    console.log(req.user.email);
    return `Olá controller do user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    // Lógica para criar um usuário usando o dto e a secretKey
    return this.userService.create(dto);
  }
}
