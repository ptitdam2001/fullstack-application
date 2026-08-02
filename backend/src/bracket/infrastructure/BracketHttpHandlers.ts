import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { BracketUseCases } from '../application/BracketUseCases.js'
import { PrismaBracketRepository } from './PrismaBracketRepository.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'

const useCases = new BracketUseCases(new PrismaBracketRepository())

export const createBracket = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}
