import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import type { IJwtPayload } from 'src/shared/types';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request: Request) => request.cookies['__v_rt_t'],
      // ]),
      secretOrKey: cfg.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IJwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    if (!refreshToken) throw new ForbiddenException('Не корректный токен');
    return { ...payload, refreshToken };
  }
}
