import { signJwt } from '../utils/jwt';
import Session from '../models/session.model';
import { UserDoc } from '../models/user.model';

async function createSession(userId: string) {
  return Session.create({ user: userId });
}

export function signAccessToken(user: UserDoc) {
  // Converting to json will remove that password field
  const payload = user.toJSON();
  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '10m',
  });
  return accessToken;
}

// This will do two things, create new entry in db and then sign that _id as refreshToken
export async function signRefreshToken(userId: string) {
  const session = await createSession(userId);
  const refreshToken = signJwt({ session: session._id }, 'refreshTokenPrivateKey', {
    expiresIn: '1y',
  });
  return refreshToken;
}

export async function findSessionById(id: string) {
  return Session.findById(id);
}
