import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import type { MatchStatus } from '../domain/Match.js'
import { MatchUseCases } from '../application/MatchUseCases.js'
import { PrismaMatchRepository } from './PrismaMatchRepository.js'
import { MatchNotFoundError } from '../domain/MatchErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'
import { BracketUseCases } from '../../bracket/application/BracketUseCases.js'
import { PrismaBracketRepository } from '../../bracket/infrastructure/PrismaBracketRepository.js'

const bracketUseCases = new BracketUseCases(new PrismaBracketRepository(), new PrismaMatchRepository())
const useCases = new MatchUseCases(new PrismaMatchRepository(), bracketUseCases)

export const countMatches = async (ctx: Context, __: Request, res: Response) => {
  requireAdmin(ctx)
  const status = ctx.request.query.status as string | undefined
  const championshipId = ctx.request.query.championshipId as string | undefined
  const ageCategoryId = ctx.request.query.ageCategoryId as string | undefined
  res.json(await useCases.count({ status: status as MatchStatus | undefined, championshipId, ageCategoryId }))
}

export const getMatches = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  const status = ctx.request.query.status as string | undefined
  const pastDue = ctx.request.query.pastDue === 'true'
  const championshipId = ctx.request.query.championshipId as string | undefined
  const ageCategoryId = ctx.request.query.ageCategoryId as string | undefined
  res.json(
    await useCases.getAll(
      { page, count },
      { status: status as MatchStatus | undefined, pastDue: pastDue || undefined, championshipId, ageCategoryId }
    )
  )
}

export const getMatch = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof MatchNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const addMatch = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const editMatch = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof MatchNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const removeMatch = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof MatchNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}
