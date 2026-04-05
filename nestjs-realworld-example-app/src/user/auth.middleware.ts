import config from '../config';
import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware, HttpStatus, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders) {
      const token = authHeaders.split(' ')[1];
      if (token) {
        const decoded: any = jwt.verify(token, config.JWT_SECRET);
        const user = await this.userService.findById(decoded.id);

        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }

        req.user = user; // не user.user, а просто user
        return next();
      }
    }

    throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
  }
}