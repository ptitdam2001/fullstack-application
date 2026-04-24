import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { StandingsUseCases } from '../application/StandingsUseCases.js'
import { PrismaStandingsRepository } from './PrismaStandingsRepository.js'

const useCases = new StandingsUseCases(new PrismaStandingsRepository())

export const getGroupStandings = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getGroupStandings(ctx.request.params.groupId))
  } catch (err) {
    if (err instanceof Error && err.name === 'NotFoundError') {
      return res.status(404).json({ status: 404, message: 'Group not found' })
    }
    throw err
  }
}
