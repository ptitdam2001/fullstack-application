import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { GroupUseCases } from '../application/GroupUseCases.js'
import { PrismaGroupRepository } from './PrismaGroupRepository.js'
import { GroupNotFoundError } from '../domain/GroupErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'

const useCases = new GroupUseCases(new PrismaGroupRepository())

export const getPhaseGroups = async (ctx: Context, _: Request, res: Response) => {
  res.json(await useCases.getByPhaseId(ctx.request.params.phaseId))
}

export const getGroup = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof GroupNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const createGroup = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const updateGroup = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof GroupNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}

export const removeGroup = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof GroupNotFoundError) return res.status(404).json({ status: 404, message: err.message })
    throw err
  }
}
