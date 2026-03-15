import type { Request, Response } from "express";
import type { Context } from "openapi-backend";
import type { User } from "@prisma/client";
import type { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

type GetUserParams = { id: string };
type CreateUserBody = Partial<Omit<User, "id">>;
type UserOutput = Omit<User, "password">;
type UserOrErrorOutput = UserOutput | ErrorOutput;

/** Returns the list of all users (passwords excluded). */
export const getUsers = async (
  _: Context,
  __: Request,
  res: Response<UserOutput[]>
) => res.json(await prisma.user.findMany({ omit: { password: true } }));

/** Returns a single user by ID. */
export const getUser = async (
  ctx: Context<GetUserParams>,
  _: Request,
  res: Response<UserOrErrorOutput>
) => {
  const id: string = ctx.request.params.id;

  const found = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });

  return found
    ? res.status(200).json(found)
    : res.status(404).json({ status: 404, message: "User not found" });
};

/** Creates a new user. */
export const createUser = async (
  _: Context,
  req: Request<CreateUserBody>,
  res: Response<UserOrErrorOutput>
) => {
  try {
    const newUser = await prisma.user.create({
      data: req.body,
      omit: { password: true },
    });
    return res.status(201).json(newUser);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return res.status(500).json({ message, status: 500 });
  }
};

/** Updates an existing user by ID. */
export const updateUser = async (
  ctx: Context<GetUserParams>,
  req: Request<CreateUserBody>,
  res: Response<UserOrErrorOutput>
) => {
  const id = ctx.request.params.id;

  try {
    const result = await prisma.user.update({
      where: { id },
      data: req.body,
      omit: { password: true },
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
};

/** Deletes a user by ID. */
export const removeUser = async (
  ctx: Context<GetUserParams>,
  _: Request,
  res: Response<null | ErrorOutput>
) => {
  const id = ctx.request.params.id;

  try {
    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: "User not found", status: 404 });
  }
};
