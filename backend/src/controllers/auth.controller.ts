import jwt from "jsonwebtoken";
import User from "../models/User";
import { compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email: string, userId: string) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY || "", {
    expiresIn: maxAge,
  });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.create({ email, password });
      res.cookie("jwt", createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: "none",
      });

      return res.status(201).json({
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Invalid Password");
      }
      res.cookie("jwt", createToken(email, user.id), {
        maxAge,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          profileSetup: user.profileSetup,
        },
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};
