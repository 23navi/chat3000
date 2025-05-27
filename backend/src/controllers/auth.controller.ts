/* eslint-disable @typescript-eslint/ban-types */
// All the strategies will go here, like email/password, google login, facebook ....

// We will only have email password strategy

import { Request, Response } from 'express';
import { CreateSessionInput } from '../schemas/auth.schema';
import { findUserByEmail, findUserById } from '../services/user.service';
import { findSessionById, signAccessToken, signRefreshToken } from '../services/auth.service';
import { verifyJwt } from '../utils/jwt';
import { Password } from '../utils/password';
import { BadRequestError, ForbiddenRequestError } from '../errors';

export async function creatSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
  const { email, password: candidatePassword } = req.body;
  const user = await findUserByEmail(email);
  console.log({ user });
  if (!user) {
    throw new BadRequestError('Email/password not correct');
  }
  if (!(await Password.compare(user.password, candidatePassword))) {
    throw new BadRequestError('Email/password not correct');
  }

  /// If we reach here, we will know that user provided correct creds, we need to provide them with token.

  // 1) Sign access token

  const accessToken = signAccessToken(user);

  // 2) Sign refresh token

  const refreshToken = await signRefreshToken(user.id);

  // 3) Send tokens back (Sending as body not header)

  // maxAge and expires are the same thing, maxAge takes time from now (Relative) and expires takes now + time (absolute time)
  res.cookie('access_token', accessToken, {
    secure: true, // secure only sends cookie if the request is over https, will not work in http
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'none',
    httpOnly: true, // This is to prevent javascript from accessing the cookie.
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
  res.cookie('refresh_token', refreshToken);
  res.send({ accessToken, refreshToken });
}

export async function refreshSessionHandler(req: Request, res: Response) {
  const refreshToken = (req.headers['x-refresh'] || '') as string | '';
  if (!refreshToken) {
    throw new BadRequestError('Invalid refresh token');
  }
  const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPrivateKey');
  if (!decoded) {
    throw new BadRequestError('Invalid refresh token');
  }
  const session = await findSessionById(decoded?.session);
  if (!session || !session.valid) {
    throw new BadRequestError('Could not refresh the token');
  }
  const user = await findUserById(String(session.user));
  if (!user) {
    throw new BadRequestError('Could not refresh the token');
  }
  const accessToken = signAccessToken(user);
  res.cookie('access_token', accessToken, {
    secure: true, // secure only sends cookie if the request is over https, will not work in http
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'none',
    httpOnly: true, // This is to prevent javascript from accessing the cookie.
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
  return res.send({ accessToken });
}
