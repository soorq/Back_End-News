import { ECategory } from '@/core/domain/entities/category.entity';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ECategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
