import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EToken } from '@/core/domain/entities/token.entity';
import type { EUser } from '@/core/domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTokenDto } from '@/shared/crud';
import { ConfigService } from '@nestjs/config';
import type { ITokens } from '@/shared/types';
import { Role } from '@/shared/roles';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
// import * as argon2 from 'argon2';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(EToken) private readonly db: Repository<EToken>,
    private readonly cfg: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  create = async (dto: EUser) => {
    try {
      const isExistToken = await this.findBy(dto.id);

      if (isExistToken) {
        throw new HttpException(
          'Такой сессия уже существует!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const { __v_AC_T, __v_RT_T } = await this.getTokens(
        dto.id,
        Role.USER,
        dto.email,
      );

      const tokens = await this.db.create({
        access: __v_AC_T,
        refresh: __v_RT_T,
        user: dto,
      });

      const res = await this.db.save(tokens);

      if (!res) {
        throw new HttpException(
          'Произошла ошибка со стороны сервера',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return res;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  findBy = async (id: string) => {
    try {
      return this.db.findOneBy({ user: { id } });
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  update = async (id: string, dto: UpdateTokenDto) => {
    try {
      const token = await this.db.findOneBy({ id });

      if (!token) {
        throw new HttpException(
          'Такой сессии не существует!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.db.update(token.id, dto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  delete = async (id: string) => {
    try {
      const token = await this.db.findOneBy({ id });

      if (!token) {
        throw new HttpException(
          'Такой сессии не существует!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.db.delete(token.id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  private async getTokens(
    userId: string,
    roles: Role | Role[],
    email: string,
  ): Promise<ITokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.cfg.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),

      this.jwt.signAsync(
        {
          sub: userId,
          email,
          roles,
        },
        {
          secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);
    return { __v_AC_T: at, __v_RT_T: rt };
  }
}
