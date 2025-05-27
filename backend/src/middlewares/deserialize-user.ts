import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';

export default function deserializeUser(req: Request, res: Response, next: NextFunction) {
  // First check Authorization header
  const authHeader = req.headers?.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.access_token) {
    // Fallback to cookie
    token = req.cookies.access_token;
  }

  if (!token) {
    return next();
  }

  const decoded = verifyJwt(token, 'accessTokenPrivateKey');

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
}
