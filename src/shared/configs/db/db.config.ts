import { DHOST, DNAME, DPASS, DUSER, NODE_ENV } from '@/shared/env';
import { Injectable } from '@nestjs/common';
import type {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

@Injectable()
export class DbConnection implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      port: 5432,
      host: DHOST || 'localhost',
      username: DUSER || 'postgres',
      password: DPASS || 'postgres',
      database: DNAME || 'test',
      retryAttempts: 5,
      retryDelay: 1000,
      synchronize: true,
      autoLoadEntities: true,
      logging: true ?? NODE_ENV === 'development',
      entities: [__dirname, '/../../../core/domain/entities/*.entity.{js,ts}'],
    };
  }
}
