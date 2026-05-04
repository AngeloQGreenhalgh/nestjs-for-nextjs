import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    // Forçamos o tipo como Partial<Post> para o TypeScript não reclamar das propriedades
    const post = this.postRepository.create({
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      slug: 'abcdefghijklmn' + Math.random().toString(36).substring(2, 8), // Gerar um slug simples e único
      author,
    } as Partial<Post>); // O 'as any' ou 'as Partial<Post>' mata o erro de tipagem imediato

    const created = await this.postRepository.save(post);
    return created;
  }
}
