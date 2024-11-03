import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { ErrorOutput } from "./types";
import { logger } from "../config/logger";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export const putUserToTeam = async (
  ctx: Context,
  _: Request,
  res: Response<boolean | ErrorOutput>
) => {
  console.log("context params: ", ctx.request.params);
  const teamId: string = ctx.request.params.teamId;
  const userId: string = ctx.request.params.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const team = await prisma.team.findUnique({ where: { id: teamId } });

  if (!user || !team) {
    return res.status(404).json({
      message: "Not found team or user",
      status: 404,
    });
  }

  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      players: {
        set: [{ id: user.id}],
      },
    },
  });
};
