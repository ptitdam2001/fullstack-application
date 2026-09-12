import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { HealthUseCases } from '../application/HealthUseCases.js'

const useCases = new HealthUseCases()

export const health = async (_: Context, __: Request, res: Response) => {
  res.json(useCases.check())
}
