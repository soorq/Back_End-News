import { TypeOrmModule } from '@nestjs/typeorm';
import { ETag } from '@/core/domain/entities';
import { TagsService } from './tags.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([ETag])],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
