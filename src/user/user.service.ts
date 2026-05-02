import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '../common/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('E-mail já existe');
    }

    const hasshedPassword = await this.hashingService.hash(dto.password);

    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hasshedPassword,
    };
    const created = this.userRepository.create(newUser);

    await this.userRepository.save(created);

    return created;
  }
}
