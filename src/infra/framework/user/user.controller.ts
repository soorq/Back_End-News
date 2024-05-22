import { EUser } from '@/core/domain/entities';
import { ACGuard } from 'nest-access-control';
import { CreateUserDto } from '@/shared/crud';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    summary: 'Создание юзера',
    description: 'Метод для создания юзера',
  })
  @ApiOkResponse({
    status: HttpStatus.CREATED,
    type: EUser,
    description: 'Отдает сущность созданную по бд',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EUser,
    description: 'Плохой запроос или не создалась сущность',
  })
  @UseGuards(ACGuard)
  @Post()
  async create(@Body() dto: CreateUserDto) {
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
  @ApiOkResponse({ status: HttpStatus.OK, type: EUser, isArray: true })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EUser,
    description: 'Плохой запроос или не найдены данные',
  })
  @UseGuards(ACGuard)
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
  @ApiOkResponse({ status: HttpStatus.OK, type: EUser, isArray: true })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EUser,
    description: 'Плохой запроос или айди не найден',
  })
  @UseGuards(ACGuard)
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
    type: EUser,

    description: 'Отдает статус успешно',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: EUser,
    description: 'Плохой запроос или айди не найден',
  })
  @UseGuards(ACGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      return this.service.delete(id);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
