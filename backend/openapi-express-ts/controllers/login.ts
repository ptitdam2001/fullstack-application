import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { type TokenData, type ErrorOutput } from "@prisma/client";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { logger } from "../config/logger";

type SigninInput = {
    email: string
    password: string
  }

  const prisma = new PrismaClient({
    // omit: {
    //   user: {
    //     password: true,
    //   },
    // },
  });

export const login = async (ctx: Context, req: Request<SigninInput>, res: Response<TokenData|ErrorOutput>, next) => {
  const { email, password } = req.body;

  console.log(process.env)

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return next(Error("User not found"));
    }

    const isMatch = bcrypt.compareSync(password, existingUser.password);
    
    if (!existingUser) {
      const error = Error("Wrong details please check at once");
      return next(error);
    } else if (isMatch) {
      // Creating jwt token
      const token = jwt.sign({ data: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return res.status(200).json({
          userId: existingUser.id,
          email: existingUser.email,
          token: token,
      });
    } else {
      return res.status(403).json({ message: "Bad password" });
    }
  } catch (err) {
    logger.error(err)
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
};
// 