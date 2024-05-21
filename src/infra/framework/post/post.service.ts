import type { CreatePostDto } from '@/shared/crud/post/create-post.dto';
import type { UpdatePostDto } from '@/shared/crud/post/update-post.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { EPost } from '@/core/domain/entities/post.entity';
import type { DataSource, Repository } from 'typeorm';
import { TagsService } from '../tags/tags.service';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  type IPaginationOptions,
  type Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  private postDb: Repository<EPost>;

  constructor(
    @InjectDataSource()
    private _ds: DataSource,
    private readonly category: CategoryService,
    private readonly tag: TagsService,
  ) {
    this.postDb = this._ds.getRepository(EPost);
  }

  create = async (id: string, dto: CreatePostDto) => {
    try {
      const isExist = await this.findByUser(id, dto.link);

      if (isExist) {
        throw new HttpException('Уже есть такой пост', HttpStatus.BAD_REQUEST);
      }

      const post = await this.postDb.create({
        ...dto,
        user: { id },
        category: null,
        tags: null,
      });

      const category = await this.category.findAll();

      const c = category.data.filter((item) =>
        dto.category_ids.includes(item.id.toString()),
      );

      if (category.data.length === 0) {
        throw new HttpException(
          'Создайте категории прежде чем использовать!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.postDb.save(post);

      const tags = await Promise.all(
        dto.tags_values.map((k) => this.tag.create({ label: k })),
      );

      await this.update(res.id, {
        category: c,
        tags,
      });

      return { message: 'Успешно создан', status: 200, data: res };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  findAll = async () => {
    try {
      const res = await this.postDb.find({
        relations: { tags: true, category: true, user: true },
      });

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
      const res = await this.postDb.findOneBy({ id });

      if (!res) {
        throw new HttpException('Ничего не найдено', HttpStatus.NOT_FOUND);
      }

      return { message: 'Успешно', data: res };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  filtered = async (opt: IPaginationOptions): Promise<Pagination<EPost>> => {
    try {
      const qb = this.postDb.createQueryBuilder('q');

      qb.orderBy('q.createdAt', 'DESC');

      return paginate(qb, { ...opt });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, dto: UpdatePostDto) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
      }

      console.log(post);

      const res = await this.postDb.update(id, {
        ...dto,
        category: dto.category,
        tags: dto.tags,
      });

      console.log(res);

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      const updatedPost = await this.postDb.findOneBy({ id });

      return { message: 'Успешно', data: updatedPost };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  delete = async (id: string) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
      }

      const res = await this.postDb.delete(id);

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Успешно', data: null };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  private findByUser = (id: string, link: string) => {
    try {
      return this.postDb.findOne({
        where: { user: { id }, link },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };
}
