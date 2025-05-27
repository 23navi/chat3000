/* eslint-disable @typescript-eslint/ban-types */
import jwt from 'jsonwebtoken';

export function signJwt(
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined,
) {
  const signingKey = process.env[keyName] || '';

  const signingKeyDecoded = Buffer.from(signingKey, 'base64').toString('ascii');

  return jwt.sign(object, signingKeyDecoded, {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt<T>(token: string, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey'): T | null {
  const publicKey = process.env[keyName] || '';
  const publicKeyDecoded = Buffer.from(publicKey, 'base64').toString('ascii');
  try {
    const decoded = jwt.verify(token, publicKeyDecoded) as T;
    return decoded;
  } catch (e) {
    return null;
  }
}
