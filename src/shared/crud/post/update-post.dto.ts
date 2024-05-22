import { ECategory, ETag } from '@/core/domain/entities';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePostDto extends PartialType(CreatePostDto) {
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
  @Type(() => ECategory)
  declare category?: ECategory[];

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
  @Type(() => ETag)
  declare tags: ETag[];
}
