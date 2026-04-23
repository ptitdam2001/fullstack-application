import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { MatchUseCases } from '../application/MatchUseCases.js'
import { PrismaMatchRepository } from './PrismaMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import { requireRoles } from '../../auth/application/requireRoles.js'
import { Role } from '../../user/domain/User.js'

const useCases = new MatchUseCases(new PrismaMatchRepository())

export const countMatches = async (_: Context, __: Request, res: Response) => {
  res.json(await useCases.count())
}

export const getMatches = async (ctx: Context, _: Request, res: Response) => {
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  res.json(await useCases.getAll({ page, count }))
}

export const getMatch = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof MatchNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const addMatch = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  res.status(201).json(await useCases.create(req.body))
}

export const editMatch = async (ctx: Context, req: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof MatchNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const removeMatch = async (ctx: Context, _: Request, res: Response) => {
  requireRoles(ctx, Role.ADMIN)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof MatchNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}
