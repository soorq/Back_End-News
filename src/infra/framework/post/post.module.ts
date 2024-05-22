import { CategoryModule } from '../category/category.module';
import { Module, forwardRef } from '@nestjs/common';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module';
import { TagsModule } from '../tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EPost } from '@/core/domain/entities';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EPost]),
    forwardRef(() => CategoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => TagsModule),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
