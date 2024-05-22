import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateUserDto } from '@/shared/crud';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly user: UserService) {}

  // Регистрация
  async signup(dto: CreateUserDto) {
    try {
      const isUserExist = await this.user.findByEmail(dto.email);

      if (isUserExist) {
        throw new HttpException(
          'Такой юзер существует уже',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passHashead = await this.hashData(dto.password);

      const {
        data: { password, ...rest },
      } = await this.user.create({
        ...dto,
        password: passHashead,
      });

      if (!rest) {
        throw new HttpException(
          'Произошла ошибка со стороны сервера',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return {
        message: 'Успешно создан',
        statusCode: 201,
        data: rest,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Вход
  async signin(dto: CreateAuthDto) {
    try {
      const { password, ...rest } = await this.user.findByEmail(dto.email);

      if (!rest) {
        throw new HttpException(
          'Такого юзера не существует',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordVerify = await argon2.verify(password, dto.password);

      if (!passwordVerify) {
        throw new HttpException(
          'Не верный логин или пароль',
          HttpStatus.FORBIDDEN,
        );
      }

      return {
        message: 'Успешно создан',
        statusCode: 201,
        data: rest,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Хэшируем какие-либо данные этой функцией
  private hashData(data: string) {
    return argon2.hash(data, { type: 2 });
  }
}
