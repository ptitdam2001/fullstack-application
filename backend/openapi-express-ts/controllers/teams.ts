import { PrismaClient, type Team } from "@prisma/client";
import { Request, Response } from "express";
import { Context } from "openapi-backend";
import { ErrorOutput } from "./types";
import { prisma } from "../utils/prismaClient";

type CreateTeamBody = Partial<Omit<Team, "id">>;
type TeamOrErrorOutput = Team | ErrorOutput;

export const getTeams = async (
  ctx: Context,
  _: Request,
  res: Response<Team[]>
) => res.json(await prisma.team.findMany({}));

export const getTeam = async (
  ctx: Context,
  _: Request,
  res: Response<TeamOrErrorOutput>
) => {
  const id: string = ctx.request.params.id;
  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  const found = await prisma.team.findUnique({
    where: {
      id,
    },
  });

  return found
    ? res.status(200).json(found)
    : res.status(404).json({
        status: 404,
        message: "Team not found",
      });
};

export const createTeam = async (
  ctx: Context,
  req: Request<CreateTeamBody>,
  res: Response<TeamOrErrorOutput>
) => {
  try {
    const newTeam = await prisma.team.create({ data: req.body });
    return res.status(200).json(newTeam);
  } catch (err) {
    return res.status(500).json({
      message: JSON.stringify(err),
      status: 500,
    });
  }
};

export const updateTeam = async (
  ctx: Context,
  req: Request<CreateTeamBody>,
  res: Response<TeamOrErrorOutput>
) => {
  const id = ctx.request.params.id;
  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  const result = await prisma.team.update({
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

export const removeTeam = async (
  ctx: Context,
  _: Request,
  res: Response<TeamOrErrorOutput>
) => {
  const id = ctx.request.params.id;

  if (!id) {
    return res.status(403).json({
      message: "Bad request - id not provided",
      status: 403,
    });
  }

  try {
    await prisma.team.delete({
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
