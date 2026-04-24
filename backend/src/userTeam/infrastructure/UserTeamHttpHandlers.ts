import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { UserTeamUseCases } from '../application/UserTeamUseCases.js'
import { PrismaUserTeamRepository } from './PrismaUserTeamRepository.js'
import { UserTeamNotFoundError, UserTeamAlreadyExistsError } from '../domain/UserTeamErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'
import { TeamRole } from '../domain/UserTeam.js'

const useCases = new UserTeamUseCases(new PrismaUserTeamRepository())

export const assignCoach = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  const { teamId, userId } = ctx.request.params
  try {
    res.status(201).json(await useCases.assign(userId, teamId, TeamRole.COACH))
  } catch (err) {
    if (err instanceof UserTeamAlreadyExistsError) return res.status(409).json({ status: 409, message: err.message })
    throw err
  }
}

export const removeCoach = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  const { teamId, userId } = ctx.request.params
  try {
    await useCases.remove(userId, teamId, TeamRole.COACH)
    res.status(204).send()
  } catch (err) {
    if (err instanceof UserTeamNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const getTeamCoaches = async (ctx: Context, _: Request, res: Response) => {
  const { teamId } = ctx.request.params
  res.json(await useCases.getTeamMembers(teamId, TeamRole.COACH))
}

export const getCoachTeams = async (ctx: Context, _: Request, res: Response) => {
  const { userId } = ctx.request.params
  res.json(await useCases.getUserTeams(userId, TeamRole.PLAYER))
}
