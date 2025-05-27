import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
export default function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers?.authorization || '';
  const token = accessToken.split(' ')[1];
  if (!token) {
    return next();
  }
  const decoded = verifyJwt(token, 'accessTokenPrivateKey');
  if (decoded) {
    // We could have gone with req.currentUser, But updating the express.Request should be avoided as much as possible
    res.locals.user = decoded;
  }
  return next();
}
