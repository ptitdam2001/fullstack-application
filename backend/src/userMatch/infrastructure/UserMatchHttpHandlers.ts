import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { UserMatchUseCases } from '../application/UserMatchUseCases.js'
import { PrismaUserMatchRepository } from './PrismaUserMatchRepository.js'
import { UserMatchNotFoundError, UserMatchAlreadyExistsError } from '../domain/UserMatchErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'

const useCases = new UserMatchUseCases(new PrismaUserMatchRepository())

export const assignReferee = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  const { matchId, userId } = ctx.request.params
  try {
    res.status(201).json(await useCases.assign(userId, matchId))
  } catch (err) {
    if (err instanceof UserMatchAlreadyExistsError) return res.status(409).json({ status: 409, message: err.message })
    throw err
  }
}

export const removeReferee = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  const { matchId, userId } = ctx.request.params
  try {
    await useCases.remove(userId, matchId)
    res.status(204).send()
  } catch (err) {
    if (err instanceof UserMatchNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const getMatchReferees = async (ctx: Context, _: Request, res: Response) => {
  const { matchId } = ctx.request.params
  res.json(await useCases.getMatchReferees(matchId))
}

export const getUserMatches = async (ctx: Context, _: Request, res: Response) => {
  const { userId } = ctx.request.params
  res.json(await useCases.getUserMatches(userId))
}
