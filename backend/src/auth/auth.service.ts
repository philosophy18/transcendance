import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dto/user.dto';
import { UserSessionDto } from 'src/dto/usersession.dto';
import { JoinType } from 'src/entity/common.enum';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUserById(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: ['play_game', 'watch_game'],
    });
  }

  async findUserByUserId(user_id: number) {
    return this.usersRepository.findOne({
      where: { user_id: user_id },
      relations: ['play_game', 'watch_game'],
    });
  }

  async findUserByIntraId(intra_id: string) {
    return this.usersRepository.findOne({
      where: { intra_id: intra_id },
      relations: ['play_game', 'watch_game'],
    });
  }

  async addUser(user: UserSessionDto) {
    const found = await this.findUserByUserId(user.user_id);
    if (!found) {
      await this.usersRepository.save({
        user_id: user.user_id,
        intra_id: user.intra_id,
        profile: '',
        introduce: '',
        normal_win: 0,
        normal_lose: 0,
        rank_win: 0,
        rank_lose: 0,
        join_type: JoinType.NONE,
      });
    }
  }
}
