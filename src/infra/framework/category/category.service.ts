import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '@/shared/crud';
import type { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ECategory } from '@/core/domain/entities';

/**
 * Class representing a Category Service.
 * Methods: create, findAll, findOne, update, delete.
 * create - Creates a new category if it doesn't exist.
 * findAll - Retrieves all categories.
 * findOne - Retrieves a specific category by ID.
 * update - Updates a category by ID.
 * delete - Deletes a category by ID.
 */
@Injectable()
export class CategoryService {
  private categoryDb: Repository<ECategory>;
  constructor(
    @InjectDataSource()
    private readonly _ds: DataSource,
  ) {
    this.categoryDb = this._ds.getRepository(ECategory);
  }

  create = async (dto: CreateCategoryDto) => {
    try {
      const isExist = await this.findByValue(dto.value);

      if (isExist) {
        throw new HttpException(
          'Уже есть такая категория',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.categoryDb.create(dto);

      return this.categoryDb.save(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  findAll = async () => {
    try {
      const res = await this.categoryDb.find();

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
      const res = await this.categoryDb.findOneBy({ id });

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

  update = async (id: string, dto: UpdateCategoryDto) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException(
          'Такая категория не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.categoryDb.update(id, { ...dto });

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      const updatedPost = await this.categoryDb.findOneBy({ id });

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

      const res = await this.categoryDb.delete(id);

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Успешно', data: null };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  private findByValue = (value: string) => {
    try {
      return this.categoryDb.findOneBy({ value });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };
}
