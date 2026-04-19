import { Request, Response } from "express";
import { Context } from "openapi-backend";
import type { ErrorOutput, SigninOuput } from "./types";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { logger } from "../config/logger";
import { prisma } from "../utils/prismaClient";

type ForgotPasswordInput = { email: string };

type SigninInput = {
    email: string
    password: string
  }

/** Authenticates a user with email and password, returns a signed JWT token. */
export const login = async (_: Context, req: Request<SigninInput>, res: Response<SigninOuput | ErrorOutput>) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    const isMatch = bcrypt.compareSync(password, existingUser.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Bad password", status: 403 });
    }

    const expiresInSeconds = 2 * 60 * 60; // 2 hours
    const token = jwt.sign(
      { data: existingUser.id },
      process.env.JWT_SECRET as string,
    { expiresIn: Number(process.env.JWT_EXPIRES || expiresInSeconds) }
    );

    return res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Error! Something went wrong.", status: 500 });
  }
};

/** Initiates a password reset flow for the given email address. */
export const forgotPassword = async (_: Context, req: Request<ForgotPasswordInput>, res: Response<ErrorOutput | void>) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // On répond 200 même si l'email n'existe pas (sécurité : ne pas divulguer les comptes)
    if (!user) {
      return res.status(200).send();
    }

    // TODO: envoyer un email de réinitialisation de mot de passe
    logger.info("Password reset requested for %s", email);

    return res.status(200).send();
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: "Error! Something went wrong.", status: 500 });
  }
};