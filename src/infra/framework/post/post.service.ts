import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { CreatePostDto, UpdatePostDto } from '@/shared/crud';
import { CategoryService } from '../category/category.service';
import type { DataSource, Repository } from 'typeorm';
import { TagsService } from '../tags/tags.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { EPost } from '@/core/domain/entities';
import {
  type IPaginationOptions,
  type Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

/**
 * PostService class handles operations related to posts, including creation, retrieval, updating, and deletion.
 * It interacts with the database to manage post entities and their relationships with categories and tags.
 *
 * Methods:
 * - create: Creates a new post entity based on the provided data, filters categories, and updates tags.
 * - findAll: Retrieves a list of posts with selected user properties and related entities.
 * - findOne: Finds a specific post by its ID.
 * - filtered: Retrieves paginated results of posts based on specified options.
 * - update: Updates an existing post entity with new data, including categories and tags.
 * - delete: Deletes a post entity by its ID.
 *
 * @class PostService
 */
@Injectable()
export class PostService {
  private postDb: Repository<EPost>;

  constructor(
    /**
     * Injects the DataSource instance into the private variable _ds.
     */
    @InjectDataSource()
    private _ds: DataSource,

    /**
     * For initializing CategoryService,UserService and TagsService instances.
     */
    private readonly category: CategoryService,
    private readonly user: UserService,
    private readonly tag: TagsService,
  ) {
    /**
     * Assigns the repository for the EPost entity to the 'postDb' property.
     */
    this.postDb = this._ds.getRepository(EPost);
  }

  create = async (dto: CreatePostDto) => {
    const queryRunner = this._ds.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExist = await this.findByUser(dto.userId, dto.link);

      if (isExist) {
        throw new HttpException('Уже есть такой пост', HttpStatus.BAD_REQUEST);
      }

      const user = (await this.user.findOne(dto.userId)).data;

      const category = await this.category.findAll();
      const c = await category.data.filter((item) =>
        dto.category_ids.includes(item.id.toString()),
      );

      const post = await queryRunner.manager.create(EPost, dto);

      post.category = c;
      post.user = user;

      if (category.data.length === 0) {
        throw new HttpException(
          'Создайте категории прежде чем использовать!',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (dto.tags_ids !== undefined && dto.tags_ids.length !== 0) {
        const tagsAll = await this.tag.findAll();

        const existingTags = await tagsAll.data.filter((k) => {
          return dto.tags_ids.includes(k.label);
        });

        const missingTags = await dto.tags_ids.filter(
          (label) => !existingTags.some((t) => t.label === label),
        );

        const tags = await Promise.all([
          ...existingTags,
          ...missingTags.map((label) => this.tag.create({ label })),
        ]);

        post.tags = tags;
      }
      const res = await this.postDb.save(post);

      await queryRunner.commitTransaction();

      return { message: 'Успешно создан', status: 200, data: res };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  };

  findAll = async () => {
    try {
      /**
       * Retrieves a list of posts with selected user properties and related categories, tags, and users.
       *
       * @returns A list of posts with specified user properties and related entities.
       */
      const res = await this.postDb.find({
        select: {
          user: {
            age: true,
            id: true,
            img: true,
            role: true,
            email: true,
            createdAt: true,
            last_name: true,
            updatedAt: true,
            first_name: true,
          },
        },
        relations: {
          category: true,
          tags: true,
          user: true,
        },
      });

      /**
       * Checks if the length of the 'res' array is 0.
       * If true, returns an object with a message 'Ничего не найдено', total 0, and data null.
       */
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
      const res = await this.postDb.findOne({
        where: { id },
        select: {
          user: {
            id: true,
            role: true,
            img: true,
            email: true,
          },
        },
        relations: { category: true, tags: true, user: true },
      });

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
      /**
       * Creates a query builder instance for the 'q' alias using the postDb repository.
       */
      const qb = this.postDb
        .createQueryBuilder('q')
        .leftJoin('q.user', 'user')
        .addSelect([
          'user.id',
          'user.first_name',
          'user.last_name',
          'user.img',
          'user.age',
          'user.role',
          'user.email',
          'user.createdAt',
          'user.updatedAt',
        ])
        .leftJoinAndSelect('q.tags', 'tags')
        .leftJoinAndSelect('q.category', 'category')
        .orderBy('q.createdAt', 'DESC');

      /**
       * Try to paginate the query builder with the provided options.
       * If an error occurs, handle it in the catch block.
       */
      return paginate(qb, { ...opt });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, { tags, category, ...rest }: UpdatePostDto) => {
    try {
      const post = await this.findOne(id);

      if (!post.data) {
        throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
      }

      const res = await this.postDb.update(id, { ...rest, category, tags });

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
/**
 * const tags = await tagsAll.data.filter((k) => {
 * const isInclude = dto.tags_ids.includes(k.label);
 * return isInclude
 * ? isInclude
 * : dto.tags_ids.filter(
 * (label) => isInclude && this.tag.create({ label }),
 * );
 * });
 */
