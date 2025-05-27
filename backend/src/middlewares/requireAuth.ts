import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors';
export default function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.user) {
    throw new NotAuthorizedError();
  }
  return next();
}
