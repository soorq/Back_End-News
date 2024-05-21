import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@/shared/crud/user/create-user.dto';
import { UpdateUserDto } from '@/shared/crud/user/update-user.dto';
import { EUser } from '@/core/domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EUser)
    private readonly db: Repository<EUser>,
  ) {}

  create = async (dto: CreateUserDto) => {
    try {
      const isExist = await this.findByEmail(dto.email);

      if (isExist) {
        throw new HttpException('Уже есть такой юзер', HttpStatus.BAD_REQUEST);
      }

      const user = await this.db.create(dto);
      const data = await this.db.save(user);
      return { message: 'Создан', status: 201, data };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  findAll = async () => {
    try {
      const res = await this.db.find();

      if (res.length === 0) {
        return { message: 'Ничего не найдено', total: 0, data: null };
      }

      return { message: 'Успешно', total: res.length, data: res };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  findOne = async (id: string) => {
    try {
      const res = await this.db.findOneBy({ id });

      if (!res) {
        throw new HttpException(
          'Ничего не найдено из юзеров',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Успешно', status: 200, data: res };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, dto: UpdateUserDto) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException(
          'Такая категория не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.db.update(id, { ...dto });

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      const updatedPost = await this.db.findOneBy({ id });

      return { message: 'Успешно', data: updatedPost };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  delete = async (id: string) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException(
          'Такая категория не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.db.delete(id);

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Успешно', status: 201, data: null };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  public findByEmail = (email: string) => {
    try {
      return this.db.findOneBy({ email });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };
}
