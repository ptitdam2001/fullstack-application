import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import type { UpdateTeamInput } from '../domain/Team.js'
import { TeamUseCases } from '../application/TeamUseCases.js'
import { PrismaTeamRepository } from './PrismaTeamRepository.js'
import { PlayerUseCases } from '../../player/application/PlayerUseCases.js'
import { PrismaPlayerRepository } from '../../player/infrastructure/PrismaPlayerRepository.js'
import { TeamNotFoundError } from '../domain/TeamErrors.js'
import { PlayerNotFoundError } from '../../player/domain/PlayerErrors.js'
import { requireAdmin, getAuthPayload, getAuthUserId } from '../../auth/application/requireRoles.js'
import { ForbiddenError } from '../../auth/domain/AuthErrors.js'
import { UserTeamUseCases } from '../../userTeam/application/UserTeamUseCases.js'
import { PrismaUserTeamRepository } from '../../userTeam/infrastructure/PrismaUserTeamRepository.js'
import { TeamRole } from '../../userTeam/domain/UserTeam.js'
import { logger } from '../../../config/logger.js'

const teamUseCases = new TeamUseCases(new PrismaTeamRepository())
const playerUseCases = new PlayerUseCases(new PrismaPlayerRepository())
const userTeamUseCases = new UserTeamUseCases(new PrismaUserTeamRepository())

export const countTeams = async (_: Context, __: Request, res: Response) => {
  res.json(await teamUseCases.count())
}

export const getTeams = async (_: Context, __: Request, res: Response) => {
  res.json(await teamUseCases.getAll())
}

export const getTeam = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await teamUseCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createTeam = async (ctx: Context, req: Request, res: Response) => {
  const auth = getAuthPayload(ctx)
  const team = await teamUseCases.create(req.body)
  if (!auth.isAdmin) {
    await userTeamUseCases.assign(auth.userId, team.id, TeamRole.COACH)
  }
  res.status(201).json(team)
}

export const updateTeam = async (ctx: Context, req: Request, res: Response) => {
  const auth = getAuthPayload(ctx)
  if (!auth.isAdmin) {
    const canAccess = await userTeamUseCases.hasRole(auth.userId, ctx.request.params.id, TeamRole.COACH)
    if (!canAccess) {
      throw new ForbiddenError()
    }
  }
  // The OpenAPI body is validated against the `Team` schema (id/areas required),
  // but `UpdateTeamInput` only persists name/color — Prisma rejects `id` as an
  // unknown `data` argument, so only the updatable fields are forwarded.
  const { name, color, ageCategoryId }: UpdateTeamInput = req.body
  try {
    res.json(await teamUseCases.update(ctx.request.params.id, { name, color, ageCategoryId }))
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const removeTeam = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await teamUseCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

// Tout utilisateur authentifié peut voir les joueurs d'une équipe
export const getTeamPlayers = async (ctx: Context, _: Request, res: Response) => {
  const teamId = ctx.request.params.teamId
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  try {
    res.json(await teamUseCases.getPlayers(teamId, { page, count }))
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const getTeamCalendar = async (ctx: Context, _: Request, res: Response) => {
  const teamId = ctx.request.params.teamId
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  const startDate = ctx.request.query.startDate ? new Date(ctx.request.query.startDate as string) : undefined
  const endDate = ctx.request.query.endDate ? new Date(ctx.request.query.endDate as string) : undefined
  try {
    res.json(await teamUseCases.getCalendar(teamId, { page, count, startDate, endDate }))
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const putUserToTeam = async (ctx: Context, _: Request, res: Response) => {
  const auth = getAuthPayload(ctx)
  if (!auth.isAdmin) {
    const canAccess = await userTeamUseCases.hasRole(auth.userId, ctx.request.params.teamId, TeamRole.COACH)
    if (!canAccess) {
      throw new ForbiddenError()
    }
  }
  const { teamId, userId } = ctx.request.params
  try {
    await playerUseCases.create({ userId, teamId, jersey: null, position: null })
    res.json(true)
  } catch (err) {
    if (err instanceof PlayerNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createPlayer = async (ctx: Context, req: Request, res: Response) => {
  const auth = getAuthPayload(ctx)
  if (!auth.isAdmin) {
    const canAccess = await userTeamUseCases.hasRole(auth.userId, req.body.teamId, TeamRole.COACH)
    if (!canAccess) {
      throw new ForbiddenError()
    }
  }
  const userId = ctx.request.params.userId
  const { teamId, jersey, position } = req.body as { teamId: string; jersey?: number; position?: string }
  res
    .status(201)
    .json(await playerUseCases.create({ userId, teamId, jersey: jersey ?? null, position: position ?? null }))
}

export const getTeamCurrentGroup = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await teamUseCases.getTeamCurrentGroup(ctx.request.params.teamId))
  } catch (err) {
    if (err instanceof TeamNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createTeamWithCoach = async (ctx: Context, req: Request, res: Response) => {
  try {
    const coachUserId = getAuthUserId(ctx)
    const result = await teamUseCases.createWithCoach(req.body, coachUserId)
    return res.status(201).json(result)
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
