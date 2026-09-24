import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { UserUseCases } from '../application/UserUseCases.js'
import { CannotSelfDemoteError, UserNotFoundError } from '../domain/UserErrors.js'
import { PrismaUserRepository } from './PrismaUserRepository.js'
import { getAuthUserId, requireAdmin } from '../../auth/application/requireRoles.js'
import { ForbiddenError, UnauthorizedError } from '../../auth/domain/AuthErrors.js'
import { JwtAuthService } from '../../auth/infrastructure/JwtAuthService.js'
import { logger } from '../../../config/logger.js'
import { parsePage, parsePageSize } from '../../../config/pagination.js'
import type { UserFilterOptions, UserListOptions } from '../ports/IUserRepository.js'

const repo = new PrismaUserRepository()
const authService = new JwtAuthService()
const useCases = new UserUseCases(repo)

const buildFilter = (query: Context['request']['query']): UserFilterOptions => ({
  ...(query.isActive !== undefined && { isActive: query.isActive === 'true' }),
})

/** Maps GET /users query params to list options. Pagination is opt-in (see UserListOptions). */
export const toUserListOptions = (query: Context['request']['query']): UserListOptions => {
  // Case 1: page or/and limit are present
  if ('page' in query || 'limit' in query) {
    const { page, limit } = query
    const parsedPage = parsePage(page, 0)
    const parsedLimit = parsePageSize(limit)

    return {
      ...buildFilter(query),
      pagination: { page: parsedPage, limit: parsedLimit },
    }
  }

  return {
    ...buildFilter(query),
  }
}

export const getUsers = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    return res.status(200).json(await useCases.getAll(toUserListOptions(ctx.request.query)))
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const countUsers = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    return res.status(200).json(await useCases.count(buildFilter(ctx.request.query)))
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const getUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    return res.status(200).json(await useCases.getById(ctx.request.params.id as string))
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const createUser = async (ctx: Context, req: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    const user = await useCases.create(req.body, p => authService.hashPassword(p))
    return res.status(201).json(user)
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const updateUser = async (ctx: Context, req: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    return res.status(200).json(await useCases.update(ctx.request.params.id as string, req.body, getAuthUserId(ctx)))
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof CannotSelfDemoteError) {
      return res.status(403).json({ message: err.message, status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const removeUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    await useCases.delete(ctx.request.params.id as string)
    return res.status(204).send()
  } catch (err) {
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
