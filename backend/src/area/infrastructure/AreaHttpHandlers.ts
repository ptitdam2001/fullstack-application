import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { AreaUseCases } from '../application/AreaUseCases.js'
import { PrismaAreaRepository } from './PrismaAreaRepository.js'
import { AreaNotFoundError } from '../domain/AreaErrors.js'
import { requireAdmin, requireAdminOrCoach } from '../../auth/application/requireRoles.js'

const useCases = new AreaUseCases(new PrismaAreaRepository())

export const countAllAreas = async (_: Context, __: Request, res: Response) => {
  res.json(await useCases.count())
}

export const getAreaList = async (ctx: Context, _: Request, res: Response) => {
  const page = Number(ctx.request.query.page) || 0
  const limit = Number(ctx.request.query.limit) || 20
  res.json(await useCases.getAll({ page, limit }))
}

export const getArea = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof AreaNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createArea = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const updateArea = async (ctx: Context, req: Request, res: Response) => {
  requireAdminOrCoach(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof AreaNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const deleteArea = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof AreaNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}
