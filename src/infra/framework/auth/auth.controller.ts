import { GetCurUser, GetCurUserId, Public } from '@/core/domain/decorator';
import { CreateAuthDto, CreateUserDto } from '@/shared/crud';
import { RefreshGuard } from '@/shared/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { ITokens } from '@/shared/types';
import { AuthService } from './auth.service';
import {
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Controller('auth')
@ApiBearerAuth('Bearer')
@ApiTags('Auth Module')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Путь на регистрацию.Post-метод, Public для метадаты, чтоб authguard jwt обойти, и получить доступ
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    try {
      const a = await this.authService.signup(dto);
      return a;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: CreateAuthDto): Promise<ITokens> {
    const tokens = await this.authService.signin(dto);
    return { __v_AC_T: '1', __v_RT_T: '1' };
  }

  @Post('logout')
  @HttpCode(HttpStatus.FORBIDDEN || HttpStatus.ACCEPTED)
  async logout(@GetCurUserId() userId: string) {
    const status = await this.authService.logout(userId);

    if (!status) {
      return {
        message: 'Не удалось',
        status: 403,
      };
    }

    return {
      message: 'Успешно',
      status: 202,
    };
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurUser('refreshToken') refresh: string,
    @GetCurUserId() userId: string,
  ) {
    return this.authService.refreshToken(userId, refresh);
  }
}
