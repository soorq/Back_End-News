import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    default: 'soorq@email.com',
    description: 'Это будет его логин, по которому, ищет по почте и отправляет',
    examples: {
      email: 'soorq@email.com',
    },
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    default: 'soorq2',
    description:
      'Это пароль, минимально 6 символов, в остальном ошибка валидации',
    examples: {
      password: '123 456 - всего 7',
    },
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;
}
