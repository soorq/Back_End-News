import { DbConnection } from '@/shared/configs/db/db.config';
import { CategoryModule } from './category/category.module';
import { AccessControlModule } from 'nest-access-control';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AccessGuard } from '@/shared/guards';
import { RBAC_POLICY } from '@/shared/roles';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: false }),
    TypeOrmModule.forRootAsync({
      useClass: DbConnection,
      dataSourceFactory: async (opt) => {
        const dataSource = await new DataSource(opt).initialize();
        return dataSource;
      },
    }),
    AccessControlModule.forRoles(RBAC_POLICY),
    CategoryModule,
    AuthModule,
    PostModule,
    TagsModule,
    UserModule,
    TokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
