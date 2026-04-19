import type { Player } from "@prisma/client";
import type { Request, Response } from "express";
import type { Context } from "openapi-backend";
import type { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

type GetUserParams = { userId: string };
type CreatePlayerBody = Partial<Omit<Player, "id" | "userId">>;
type PlayerOrErrorOutput = Player | ErrorOutput;

/** Creates a player profile linked to an existing user. */
export const createPlayer = async (
  ctx: Context<GetUserParams>,
  req: Request<CreatePlayerBody>,
  res: Response<PlayerOrErrorOutput>
) => {
  const userId: string = ctx.request.params.userId;

  try {
    const newPlayer = await prisma.player.create({
      data: { ...req.body, userId },
    });
    return res.status(201).json(newPlayer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return res.status(500).json({ message, status: 500 });
  }
};
