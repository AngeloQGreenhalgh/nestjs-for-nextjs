import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, limits, storage } from './upload.config';

@Controller('upload')
export class UploadController {
  constructor(private readonly upLoadService: UploadService) {}

  @Post()
  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage, limits, fileFilter }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.upLoadService.handleUpload(file);
  }
}
