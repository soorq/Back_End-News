import { ECategory } from '@/core/domain/entities/category.entity';
import { ETag } from '@/core/domain/entities/tag.entity';
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
  category: ECategory[];

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
  tags: ETag[];
}
