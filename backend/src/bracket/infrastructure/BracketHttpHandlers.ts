import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { BracketUseCases } from '../application/BracketUseCases.js'
import { PrismaBracketRepository } from './PrismaBracketRepository.js'
import { BracketNotFoundError, BracketLockedError, BracketInvalidShapeError } from '../domain/BracketErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'
import { PrismaMatchRepository } from '../../match/infrastructure/PrismaMatchRepository.js'

const useCases = new BracketUseCases(new PrismaBracketRepository(), new PrismaMatchRepository())

export const createBracket = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const generateBracketMatches = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.status(201).json(await useCases.generateMatches(ctx.request.params.id))
  } catch (err) {
    if (err instanceof BracketNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    if (err instanceof BracketLockedError) {
      return res.status(409).json({ status: 409, message: err.message })
    }
    if (err instanceof BracketInvalidShapeError) {
      return res.status(400).json({ status: 400, message: err.message })
    }
    throw err
  }
}
