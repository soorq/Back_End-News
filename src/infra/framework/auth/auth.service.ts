import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateUserDto } from '@/shared/crud';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly token: TokenService,
    private readonly user: UserService,
  ) {}

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

      const user = await this.user.create({
        ...dto,
        password: passHashead,
      });

      if (!user) {
        throw new HttpException(
          'Произошла ошибка со стороны сервера',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const token = await this.token.create(user.data);

      await this.user.update(user.data.id, { token });

      return {
        message: 'Успешно создан',
        statusCode: 201,
        data: token,
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Вход
  async signin(dto: CreateAuthDto) {
    try {
      const user = await this.user.findByEmail(dto.email);

      if (!user) {
        throw new HttpException(
          'Такого юзера не существует',
          HttpStatus.BAD_REQUEST,
        );
      }

      const passwordVerify = await argon2.verify(user.password, dto.password);

      if (!passwordVerify) {
        throw new HttpException(
          'Не верный логин или пароль',
          HttpStatus.FORBIDDEN,
        );
      }

      const token = await this.token.updateTokens(user);

      await this.user.update(user.id, { token });

      return {
        message: 'Успешно создан',
        statusCode: 201,
        data: { ...token },
      };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  // Хэшируем какие-либо данные этой функцией
  private hashData(data: string) {
    return argon2.hash(data, { type: 2 });
  }

  // Получение пары. Функция внутреняя
}
