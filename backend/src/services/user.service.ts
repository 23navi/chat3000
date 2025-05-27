import User, { UserAttrs } from '../models/user.model';

export function createUser(input: UserAttrs) {
  return User.build(input);
}

export function findUserById(id: string) {
  return User.findById(id);
}

export function findUserByEmail(email: string) {
  return User.findOne({ email });
}
