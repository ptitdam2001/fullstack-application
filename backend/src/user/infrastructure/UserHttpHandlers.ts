import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { UserUseCases } from '../application/UserUseCases.js'
import { UserNotFoundError } from '../domain/UserErrors.js'
import { PrismaUserRepository } from './PrismaUserRepository.js'
import { requireRoles } from '../../auth/application/requireRoles.js'
import { Role } from '../domain/User.js'
import { ForbiddenError, UnauthorizedError } from '../../auth/domain/AuthErrors.js'
import { JwtAuthService } from '../../auth/infrastructure/JwtAuthService.js'
import { logger } from '../../../config/logger.js'

const repo = new PrismaUserRepository()
const authService = new JwtAuthService()
const useCases = new UserUseCases(repo)

export const getUsers = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireRoles(ctx, Role.ADMIN)
    return res.status(200).json(await useCases.getAll())
  } catch (err) {
    if (err instanceof ForbiddenError) return res.status(403).json({ message: 'Forbidden', status: 403 })
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const getUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireRoles(ctx, Role.ADMIN)
    return res.status(200).json(await useCases.getById(ctx.request.params.id as string))
  } catch (err) {
    if (err instanceof ForbiddenError) return res.status(403).json({ message: 'Forbidden', status: 403 })
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    if (err instanceof UserNotFoundError) return res.status(404).json({ message: 'User not found', status: 404 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const createUser = async (ctx: Context, req: Request, res: Response) => {
  try {
    requireRoles(ctx, Role.ADMIN)
    const user = await useCases.create(req.body, p => authService.hashPassword(p))
    return res.status(201).json(user)
  } catch (err) {
    if (err instanceof ForbiddenError) return res.status(403).json({ message: 'Forbidden', status: 403 })
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const updateUser = async (ctx: Context, req: Request, res: Response) => {
  try {
    requireRoles(ctx, Role.ADMIN)
    return res.status(200).json(await useCases.update(ctx.request.params.id as string, req.body))
  } catch (err) {
    if (err instanceof ForbiddenError) return res.status(403).json({ message: 'Forbidden', status: 403 })
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    if (err instanceof UserNotFoundError) return res.status(404).json({ message: 'User not found', status: 404 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const removeUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireRoles(ctx, Role.ADMIN)
    await useCases.delete(ctx.request.params.id as string)
    return res.status(204).send()
  } catch (err) {
    if (err instanceof ForbiddenError) return res.status(403).json({ message: 'Forbidden', status: 403 })
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    if (err instanceof UserNotFoundError) return res.status(404).json({ message: 'User not found', status: 404 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
