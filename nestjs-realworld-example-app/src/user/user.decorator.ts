import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import config from '../config';
import * as jwt from 'jsonwebtoken';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  // если пользователь уже есть (middleware)
  if (req.user) {
    return data ? req.user[data] : req.user;
  }

  // извлекаем JWT из заголовка Authorization
  const authHeader = req.headers.authorization as string;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, config.JWT_SECRET);
        return data ? decoded[data] : decoded.user;
      } catch {
        return null;
      }
    }
  }

  return null; // если нет токена и нет user
});