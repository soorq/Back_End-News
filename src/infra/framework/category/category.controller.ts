import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ECategory } from '@/core/domain/entities/category.entity';
import { CreateCategoryDto } from '@/shared/crud/category/create-category.dto';

@Controller('category')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiOperation({
    summary: 'Создание сущности',
    description: '',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: ECategory,
    description: 'Отдает сущность созданную по бд',
  })
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    try {
      return this.service.create(dto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiOperation({
    summary: 'Получение всех категорий',
    description: 'Получение всех категорий',
  })
  @ApiOkResponse({ status: HttpStatus.OK, type: ECategory, isArray: true })
  @Get('all')
  async getAll() {
    try {
      return this.service.findAll();
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiOperation({
    summary: 'Поиск по айди',
    description: 'Получение по индефикатору',
  })
  @ApiOkResponse({ status: HttpStatus.OK, type: ECategory, isArray: true })
  @Get('getBy/:id')
  async getOne(@Param('id') id: string) {
    try {
      return this.service.findOne(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiOperation({
    summary: 'Удаление по айди',
    description: 'Удаление категории по индефикатору',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: ECategory,
    description: 'Отдает статус успешно',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: ECategory,
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
