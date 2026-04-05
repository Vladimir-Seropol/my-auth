import config from '../config';
import * as jwt from 'jsonwebtoken';

export class BaseController {

  constructor() {}

  protected getUserIdFromToken(authorization?: string): number | null {
    if (!authorization) return null;

    const token = authorization.split(' ')[1];
    if (!token) return null;

    try {
      const decoded: any = jwt.verify(token, config.JWT_SECRET);
      return decoded.id;
    } catch (err) {
      // токен недействителен или просрочен
      return null;
    }
  }
}