import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-parse.pipe';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  findOne(
    @Param('id', CustomParseIntPipe)
    id: number,
  ): string {
    return `Olá controller do user #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    // Lógica para criar um usuário usando o dto e a secretKey
    return this.userService.create(dto);
  }
}
