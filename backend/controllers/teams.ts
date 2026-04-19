import { type Team, type Player, type Game } from "@prisma/client";
import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

type CreateTeamBody = Partial<Omit<Team, "id">>;
type TeamOrErrorOutput = Team | ErrorOutput;

/** Returns the total number of teams. */
export const countTeams = async (
  _: Context,
  __: Request,
  res: Response<number>
) => res.json(await prisma.team.count());

/** Returns the list of all teams. */
export const getTeams = async (
  _: Context,
  __: Request,
  res: Response<Team[]>
) => res.json(await prisma.team.findMany({}));

/** Returns a single team by ID. */
export const getTeam = async (
  ctx: Context,
  _: Request,
  res: Response<TeamOrErrorOutput>
) => {
  const id: string = ctx.request.params.id;

  const found = await prisma.team.findUnique({ where: { id } });

  return found
    ? res.status(200).json(found)
    : res.status(404).json({ status: 404, message: "Team not found" });
};

/** Creates a new team. */
export const createTeam = async (
  _: Context,
  req: Request<CreateTeamBody>,
  res: Response<TeamOrErrorOutput>
) => {
  try {
    const newTeam = await prisma.team.create({ data: req.body });
    return res.status(201).json(newTeam);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    return res.status(500).json({ message, status: 500 });
  }
};

/** Updates an existing team by ID. */
export const updateTeam = async (
  ctx: Context,
  req: Request<CreateTeamBody>,
  res: Response<TeamOrErrorOutput>
) => {
  const id = ctx.request.params.id;

  try {
    const result = await prisma.team.update({ where: { id }, data: req.body });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: "Team not found", status: 404 });
  }
};

/** Returns a paginated list of players belonging to a team. */
export const getTeamPlayers = async (
  ctx: Context,
  _: Request,
  res: Response<Player[] | ErrorOutput>
) => {
  const teamId: string = ctx.request.params.teamId;
  const page = Number(ctx.request.query.page) || 1;
  const count = Number(ctx.request.query.count) || 20;

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return res.status(404).json({ message: "Team not found", status: 404 });
  }

  const players = await prisma.player.findMany({
    where: { teamId },
    skip: (page - 1) * count,
    take: count,
  });

  return res.status(200).json(players);
};

/** Returns a paginated list of games for a team, optionally filtered by date range. */
export const getTeamCalendar = async (
  ctx: Context,
  _: Request,
  res: Response<Game[] | ErrorOutput>
) => {
  const teamId: string = ctx.request.params.teamId;
  const page = Number(ctx.request.query.page) || 1;
  const count = Number(ctx.request.query.count) || 20;
  const startDate = ctx.request.query.startDate ? new Date(ctx.request.query.startDate as string) : undefined;
  const endDate = ctx.request.query.endDate ? new Date(ctx.request.query.endDate as string) : undefined;

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (!team) {
    return res.status(404).json({ message: "Team not found", status: 404 });
  }

  const games = await prisma.game.findMany({
    where: {
      gameTeams: { some: { teamId } },
      ...(startDate || endDate ? {
        date: {
          ...(startDate ? { gte: startDate } : {}),
          ...(endDate ? { lte: endDate } : {}),
        },
      } : {}),
    },
    skip: (page - 1) * count,
    take: count,
    orderBy: { date: 'asc' },
  });

  return res.status(200).json(games);
};

/** Deletes a team by ID. */
export const removeTeam = async (
  ctx: Context,
  _: Request,
  res: Response<null | ErrorOutput>
) => {
  const id = ctx.request.params.id;

  try {
    await prisma.team.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return res.status(404).json({ message: "Team not found", status: 404 });
  }
};
