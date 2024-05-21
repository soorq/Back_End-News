import { ArrayMinSize, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({
    name: 'title',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Название пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    name: 'desc',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Описание пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  desc: string;

  @ApiProperty({
    name: 'city',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Уникальное значение пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  city: string;

  @ApiProperty({
    name: 'link',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'http://localhost:1010/api/posts/2',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  link: string;

  @ApiProperty({
    name: 'category ids',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Уникальное значение пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @ArrayMinSize(1)
  @Type(() => String)
  category_ids: string[];

  @ApiProperty({
    name: 'category ids',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Уникальное значение пример',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @Type(() => String)
  tags_values: string[];
}
