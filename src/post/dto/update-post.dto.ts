import { PartialType, PickType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(
  PickType(CreatePostDto, ['title', 'coverImageUrl', 'excerpt', 'content']),
) {
  @IsOptional()
  @IsBoolean({ message: 'Campo de publicar post precisa ser booleano' })
  published?: boolean;
}
