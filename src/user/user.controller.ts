import { Controller, Get, Param } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-parse.pipe';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':id')
  findOne(
    @Param('id', CustomParseIntPipe)
    id: number,
  ): string {
    // console.log(process.env.TESTE);
    // console.log(process.env.TESTE3 || 'PARAMETRO NÃO EXISTE');
    // console.log(this.configService.get('TESTE1', 'VALOR PADRÃO'));
    // //console.log(this.configService.getOrThrow('TESTE1'));
    // console.log(id, typeof id);
    return `Olá controller do user #${id}`;
  }
}
