import { IsEmail, IsString, MinLength } from 'class-validator';
import { EPost } from '@/core/domain/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: 'first_name',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Имя пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    name: 'last_name',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Фамилия пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    name: 'img',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'https://soorq.ru/img.jpg',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  img: string;

  @ApiProperty({
    name: 'age',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: '19',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  age: string;

  @ApiProperty({
    name: 'email',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'soorq@gmail.com',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    name: 'password',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'qwerty123',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    name: 'posts',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Уникальное значение пример',
    description: 'Обязательное поле',
    type: String,
  })
  posts: EPost[];
}
