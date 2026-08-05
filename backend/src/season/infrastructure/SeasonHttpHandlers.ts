import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { SeasonUseCases } from '../application/SeasonUseCases.js'
import { PrismaSeasonRepository } from './PrismaSeasonRepository.js'
import { SeasonNotFoundError, SeasonDuplicateLabelError, SeasonHasUnfinishedChampionshipsError } from '../domain/SeasonErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'
import { ChampionshipUseCases } from '../../championship/application/ChampionshipUseCases.js'
import { PrismaChampionshipRepository } from '../../championship/infrastructure/PrismaChampionshipRepository.js'
import { PrismaPhaseRepository } from '../../phase/infrastructure/PrismaPhaseRepository.js'
import { PrismaGroupRepository } from '../../group/infrastructure/PrismaGroupRepository.js'
import { PrismaMatchRepository } from '../../match/infrastructure/PrismaMatchRepository.js'
import { PrismaBracketRepository } from '../../bracket/infrastructure/PrismaBracketRepository.js'

const championshipUseCases = new ChampionshipUseCases(
  new PrismaChampionshipRepository(),
  new PrismaPhaseRepository(),
  new PrismaGroupRepository(),
  new PrismaMatchRepository(),
  new PrismaBracketRepository()
)
const useCases = new SeasonUseCases(new PrismaSeasonRepository(), championshipUseCases)

export const countSeasons = async (_: Context, __: Request, res: Response) => {
  res.json(await useCases.count())
}

export const getSeasons = async (ctx: Context, _: Request, res: Response) => {
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  res.json(await useCases.getAll({ page, count }))
}

export const getSeason = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof SeasonNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createSeason = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.status(201).json(await useCases.create(req.body))
  } catch (err) {
    if (err instanceof SeasonDuplicateLabelError) {
      return res.status(409).json({ status: 409, message: err.message })
    }
    throw err
  }
}

export const updateSeason = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof SeasonNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    if (err instanceof SeasonDuplicateLabelError) {
      return res.status(409).json({ status: 409, message: err.message })
    }
    throw err
  }
}

export const removeSeason = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.archive(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof SeasonNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    if (err instanceof SeasonHasUnfinishedChampionshipsError) {
      return res.status(409).json({ status: 409, message: err.message })
    }
    throw err
  }
}
