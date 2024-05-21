import { EPost } from '@/core/domain/entities/post.entity';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { Module, forwardRef } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EPost]),
    forwardRef(() => CategoryModule),
    forwardRef(() => TagsModule),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
