import { EToken } from '@/core/domain/entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([EToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        global: true,
        privateKey: cfg.get<string>('JWT_ACCESS_SECRET'),
        secret: cfg.get<string>('JWT_ACCESS_SECRET'),
        publicKey: cfg.get<string>('JWT_REFRESH_SECRET'),
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
