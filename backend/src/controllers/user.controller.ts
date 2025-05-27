/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response, NextFunction } from 'express';
import { CreateUserInput } from '../schemas/user.schema';
import User from '../models/user.model';
import { ResourceAlreadyExistError } from '../errors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


const registerUser = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  const { email, password, } = req.body;
  let { name, username } = req.body

  const someRandomUuid = uuidv4();
  if (!name) {
    name = `RandomName${someRandomUuid}`
  }
  if (!username) {
    username = someRandomUuid
  }

  const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });

  if (existingUser?.email === email) {
    throw new ResourceAlreadyExistError('Try other email id');
  }
  if (existingUser?.username === username) {
    throw new ResourceAlreadyExistError('Try other username');
  }

  const newUser = await User.create({
    name,
    email,
    password,
    username,
  });

  await newUser.save();

  return res.status(201).json({ user: newUser });


};

const currentUser = async (req: Request, res: Response, next: NextFunction) => {
  // If user is logged in the deserialize middleware will add user to res.locals and this is behiend require auth middleware
  return res.send({ user: res.locals.user });
};
export { registerUser, currentUser };

interface IValidation {
  otpValidity: string;
  otp: number;
  jwtToken: string;
  expiryTimeInMs: number;
}

function generateOTP() {
  // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
}
export const createValidation = (userEmail: string): IValidation => {
  const otp = generateOTP();
  const expiryTimeInMs = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  const jwtToken = jwt.sign({ email: userEmail, otp: otp }, process.env.JWT_VALIDATION_SECRET!, {
    expiresIn: expiryTimeInMs,
  });

  return { expiryTimeInMs, otpValidity: '5 minutes', otp, jwtToken };
};
