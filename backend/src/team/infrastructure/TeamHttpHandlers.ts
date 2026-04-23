import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { TeamUseCases } from '../application/TeamUseCases.js'
import { PrismaTeamRepository } from './PrismaTeamRepository.js'
import { PlayerUseCases } from '../../player/application/PlayerUseCases.js'
import { PrismaPlayerRepository } from '../../player/infrastructure/PrismaPlayerRepository.js'
import { TeamNotFoundError } from '../domain/TeamErrors.js'
import { PlayerNotFoundError } from '../../player/domain/PlayerErrors.js'
import { requireRoles } from '../../auth/application/requireRoles.js'
import { Role } from '../../user/domain/User.js'

const teamUseCases = new TeamUseCases(new PrismaTeamRepository())
const playerUseCases = new PlayerUseCases(new PrismaPlayerRepository())

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
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const createTeam = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  res.status(201).json(await teamUseCases.create(req.body))
}

export const updateTeam = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    res.json(await teamUseCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const removeTeam = async (ctx: Context, _: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    await teamUseCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const getTeamPlayers = async (ctx: Context, _: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN, Role.COACH)
  const teamId = ctx.request.params.teamId
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  try {
    res.json(await teamUseCases.getPlayers(teamId, { page, count }))
  } catch (err) {
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
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
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const putUserToTeam = async (ctx: Context, _: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN, Role.COACH)
  const { teamId, userId } = ctx.request.params
  try {
    await playerUseCases.assignToTeam(userId, teamId)
    res.json(true)
  } catch (err) {
    if (err instanceof PlayerNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    if (err instanceof TeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const createPlayer = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN, Role.COACH)
  const userId = ctx.request.params.userId
  try {
    res.status(201).json(await playerUseCases.create({ ...req.body, userId }))
  } catch (err) {
    throw err
  }
}
