import { CreateAuthDto, CreateUserDto } from '@/shared/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from '@/core/domain/decorator';
import {
  Post,
  Body,
  HttpCode,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Controller('auth')
@ApiBearerAuth('Bearer')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // Путь на регистрацию.Post-метод, Public для метадаты, чтоб authguard jwt обойти, и получить доступ
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto) {
    try {
      return this.auth.signup(dto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: CreateAuthDto) {
    try {
      return this.auth.signin(dto);
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
