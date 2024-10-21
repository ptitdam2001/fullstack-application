import { Router } from "express";
import { prisma } from "../config/prisma";
import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../config/logger";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { SigninOuput } from "../types";

const router = Router();

router.post("/", async (req: Request<Partial<Omit<User, 'id'>>>, res: Response<SigninOuput>, next: NextFunction) => {
  const { password, ...user } = req.body;

  // Crypt the password
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.CRYPT_SALT)
  );

  try {
    const newUser = await prisma.user.create({
      data: { ...user, password: passwordHash },
    });

    const token = jwt.sign(newUser.id, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    return res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
        token: token,
      });
  } catch (err) {
    logger.error("Error! Something went wrong:", err);
    return next(new Error(`Error! Something went wrong: ${JSON.stringify(err)}`));
  }
});

export default router;
