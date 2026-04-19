import type { Request, Response } from "express";
import type { Context } from "openapi-backend";
import type { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

/** Assigns a user's player profile to a team. */
export const putUserToTeam = async (
  ctx: Context,
  _: Request,
  res: Response<boolean | ErrorOutput>
) => {
  const teamId: string = ctx.request.params.teamId;
  const userId: string = ctx.request.params.userId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const team = await prisma.team.findUnique({ where: { id: teamId } });

  if (!user || !team) {
    return res.status(404).json({ message: "Team or user not found", status: 404 });
  }

  try {
    await prisma.player.update({
      where: { userId },
      data: { teamId },
    });
    return res.status(200).json(true);
  } catch (err) {
    return res.status(404).json({ message: "Player profile not found for this user", status: 404 });
  }
};
