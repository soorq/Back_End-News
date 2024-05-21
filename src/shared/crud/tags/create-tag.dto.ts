import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    name: 'label',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    example: 'Для дома',
    description: 'Обязательное поле',
    required: true,
    type: String,
  })
  @IsString()
  label: string;
}
