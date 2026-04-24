import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { PhaseUseCases } from '../application/PhaseUseCases.js'
import { PrismaPhaseRepository } from './PrismaPhaseRepository.js'
import { PhaseNotFoundError } from '../domain/PhaseErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'

const useCases = new PhaseUseCases(new PrismaPhaseRepository())

export const getChampionshipPhases = async (ctx: Context, _: Request, res: Response) => {
  res.json(await useCases.getByChampionshipId(ctx.request.params.championshipId))
}

export const getPhase = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof PhaseNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const createPhase = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const updatePhase = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof PhaseNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const removePhase = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof PhaseNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}
