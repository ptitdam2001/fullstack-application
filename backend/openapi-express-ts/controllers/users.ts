import type { Request, Response } from "express";
import type { Context } from "openapi-backend";
import { PrismaClient, type User } from "@prisma/client";
import type { ErrorOutput } from "./types";
import { logger } from "../config/logger";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

type GetUserParams = { id: string };
type CreateUserBody = Partial<Omit<User, "id">>;
type UserOutput = Omit<User, "password">;
type UserOrErrorOutput = UserOutput | ErrorOutput;

export const getUsers = async (
  ctx: Context,
  _: Request,
  res: Response<UserOutput[]>
) => res.json(await prisma.user.findMany({}));

export const getUser = async (
  ctx: Context<GetUserParams>,
  req: Request,
  res: Response<UserOrErrorOutput>
) => {
  const id: string = ctx.request.params.id;
  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  const found = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  return found
    ? res.status(200).json(found)
    : res.status(404).json({
        status: 404,
        message: "User not found",
      });
};

export const createUser = async (
  _: Context,
  req: Request<CreateUserBody>,
  res: Response<UserOrErrorOutput>
) => {
  try {
    const newUser = await prisma.user.create({ data: req.body });
    return res.status(200).json(newUser);
  } catch (err) {
    return res.status(500).json({
      message: JSON.stringify(err),
      status: 500,
    });
  }
};

export const updateUser = async (
  ctx: Context<GetUserParams>,
  req: Request<CreateUserBody>,
  res: Response<UserOrErrorOutput>
) => {
  const id = ctx.request.params.id;
  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: req.body,
  });

  if (!result) {
    return res.status(404).json({
      message: "User does not exist",
      status: 404,
    });
  }

  return res.status(200).json(result);
};

export const removeUser = async (
  ctx: Context<GetUserParams>,
  _: Request,
  res: Response<null | ErrorOutput>
) => {
  const id = ctx.request.params.id;

  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
    return res.status(204).json();
  } catch (err) {
    return res.status(404).json({
      message: JSON.stringify(err),
      status: 404,
    });
  }
};
