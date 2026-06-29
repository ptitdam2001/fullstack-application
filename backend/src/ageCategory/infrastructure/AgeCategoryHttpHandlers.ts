import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { AgeCategoryUseCases } from '../application/AgeCategoryUseCases.js'
import { PrismaAgeCategoryRepository } from './PrismaAgeCategoryRepository.js'
import { AgeCategoryNotFoundError } from '../domain/AgeCategoryErrors.js'
import { requireAdmin } from '../../auth/application/requireRoles.js'

const useCases = new AgeCategoryUseCases(new PrismaAgeCategoryRepository())

export const countAgeCategories = async (_: Context, __: Request, res: Response) => {
  res.json(await useCases.count())
}

export const getAgeCategories = async (ctx: Context, _: Request, res: Response) => {
  const page = Number(ctx.request.query.page) || 1
  const count = Number(ctx.request.query.count) || 20
  res.json(await useCases.getAll({ page, count }))
}

export const getAgeCategory = async (ctx: Context, _: Request, res: Response) => {
  try {
    res.json(await useCases.getById(ctx.request.params.id))
  } catch (err) {
    if (err instanceof AgeCategoryNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const createAgeCategory = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  res.status(201).json(await useCases.create(req.body))
}

export const updateAgeCategory = async (ctx: Context, req: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    res.json(await useCases.update(ctx.request.params.id, req.body))
  } catch (err) {
    if (err instanceof AgeCategoryNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}

export const removeAgeCategory = async (ctx: Context, _: Request, res: Response) => {
  requireAdmin(ctx)
  try {
    await useCases.delete(ctx.request.params.id)
    res.status(204).send()
  } catch (err) {
    if (err instanceof AgeCategoryNotFoundError) {
      return res.status(404).json({ status: 404, message: err.message })
    }
    throw err
  }
}
