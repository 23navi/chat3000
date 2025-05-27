/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response, NextFunction } from 'express';
import { CreateUserInput } from '../schemas/user.schema';
import User from '../models/user.model';
import { ResourceAlreadyExistError } from '../errors';
import jwt from 'jsonwebtoken';
import ejs from 'ejs';
import path from 'path';

const registerUser = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  const { name, email, password, username } = req.body;

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

  const verificationDetails = createValidation(newUser.email);

  newUser.verificationOTP = verificationDetails.otp;
  newUser.verificationOTPExpiration = new Date(verificationDetails.expiryTimeInMs);

  const ejsHtml = await ejs.renderFile(path.join(__dirname, '..', 'mails', 'activation-mail.ejs'), {
    otpValidity: verificationDetails.otpValidity,
    otp: verificationDetails.otp,
    username: newUser.username,
  });

  // Not sending email in dev mode.
  console.log({ OTP: verificationDetails.otp });
  // sendEmail({
  //   from: 'navisureka23@gmail.com',
  //   to: newUser.email,
  //   subject: 'Please verify your email',
  //   // text: 'Test',
  //   html: ejsHtml,
  // });

  await newUser.save();

  return res.status(201).json({ user: newUser });

  // This is already handled by zod
  //   if (password !== passwordConfirmation) {
  //     return res.status(400).json({ message: "Passwords do not match" });
  //   }
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
