import { PrismaClient, type Player } from "@prisma/client";
import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

type GetUserParams = { userId: string };
type CreatePlayerBody = Partial<Omit<Player, "id" | "userId">>;
type PlayerOrErrorOutput = Player | ErrorOutput;

export const createPlayer = async (
  ctx: Context<GetUserParams>,
  req: Request<CreatePlayerBody>,
  res: Response<PlayerOrErrorOutput>
) => {
  const userId: string = ctx.request.params.userId;
  if (!userId) {
    return res.status(403).json({
      message: "User not found",
      status: 404,
    });
  }

  try {
    const newPlayer = await prisma.player.create({
      data: {...req.body, userId},
    });
    return res.status(200).json(newPlayer);
  } catch (err) {
    return res.status(500).json({
      message: JSON.stringify(err),
      status: 500,
    });
  }
};
