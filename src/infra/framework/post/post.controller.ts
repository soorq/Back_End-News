import { CreatePostDto } from '@/shared/crud/post/create-post.dto';
import { UpdatePostDto } from '@/shared/crud/post/update-post.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { EPost } from '@/core/domain/entities';
import { ACGuard } from 'nest-access-control';
import { PostService } from './post.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurUserId } from '@/core/domain/decorator';

@Controller('post')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @ApiOperation({
    summary: 'Создание',
    description: 'Для создания поста',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: EPost,
    description: 'Отдает сущность созданную по бд',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или не прошло создание за ряд причин',
  })
  @UseGuards(ACGuard)
  @Post()
  create(@GetCurUserId() id: string, @Body() dto: CreatePostDto) {
    try {
      return this.service.create(id, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Получение всех',
    description: 'Для получения всех постов',
  })
  @ApiOkResponse({ status: HttpStatus.OK, type: EPost, isArray: true })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или не найдены данные',
  })
  @UseGuards(ACGuard)
  @Get('all')
  async getAll() {
    try {
      return this.service.findAll();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Получение по уникальному значению',
    description: 'Получение одного поста по айди',
  })
  @ApiOkResponse({ status: HttpStatus.OK, type: EPost, isArray: true })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или айди не найден',
  })
  @UseGuards(ACGuard)
  @Get('getBy/:id')
  async getOne(@Param('id') id: string) {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Получение отсортированных',
    description: 'Для получения сортированных постов',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Отдает филтрованные посты по бд',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или айди не найден',
  })
  @UseGuards(ACGuard)
  @Get('filters')
  async getFiltered(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
  ) {
    try {
      const opt: IPaginationOptions = {
        limit,
        page,
      };

      return this.service.filtered(opt);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Обновление по уникальному значению',
    description: 'Для обновления поста по айди',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: EPost,
    description: 'Обновляет сущность созданную по бд',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или айди не найден',
  })
  @UseGuards(ACGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    try {
      return await this.service.update(id, dto);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({
    summary: 'Удаление по уникальному значению',
    description: 'Для удаления поста по айди',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: EPost,
    description: 'Отдает статус успешно',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EPost,
    description: 'Плохой запроос или айди не найден',
  })
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      return this.service.delete(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
