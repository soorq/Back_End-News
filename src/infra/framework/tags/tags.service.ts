import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ETag } from '@/core/domain/entities';
import { UpdateTagDto } from '@/shared/crud';
import { Repository } from 'typeorm';

/**
 * TagsService class responsible for managing tags.
 * Methods: create, findOne, update, findAll, delete, findByLabel.
 * create - Creates a new token for a user.
 * findAll - Finds all tags in DB.
 * findOne - Finds a token by user ID.
 * update - Updates a token with new data.
 * findByLabel - Finds a all tags.
 * delete - Deletes a token by ID.
 */
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(ETag)
    private readonly db: Repository<ETag>,
  ) {}

  create = async (dto: { label: string }) => {
    try {
      const isExist = await this.findByLabel(dto.label);

      if (isExist) {
        throw new HttpException(
          'Уже есть такая категория',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.db.create(dto);

      return this.db.save(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  findAll = async () => {
    try {
      const res = await this.db.find();

      if (res.length === 0) {
        return { message: 'Ничего не найдено', total: 0, data: [] };
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
          'Ничего не найдено из категорий',
          HttpStatus.NOT_FOUND,
        );
      }

      return { message: 'Успешно', data: res };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, dto: UpdateTagDto) => {
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

      return { message: 'Успешно', data: null };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  private findByLabel = (label: string) => {
    try {
      return this.db.findOneBy({ label });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };
}
