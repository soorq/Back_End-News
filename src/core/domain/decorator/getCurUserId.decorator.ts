import {
  ExecutionContext,
  ForbiddenException,
  createParamDecorator,
} from '@nestjs/common';
import type { IJwtPayload } from 'src/shared/types';

export const GetCurUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;
    if (!user) {
      throw new ForbiddenException('Простите, не валидный токен или отсутсвие');
    }
    return user.sub;
  },
);
