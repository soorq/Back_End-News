import { EUser } from '@/core/domain/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({
    name: 'refresh',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    required: true,
    type: String,
  })
  refresh: string;

  @ApiProperty({
    name: 'access',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    required: true,
    type: String,
  })
  access: string;

  @ApiProperty({
    name: 'user',
    nullable: false,
    maxLength: 255,
    minLength: 10,
    required: true,
    type: String,
  })
  user: EUser;
}
