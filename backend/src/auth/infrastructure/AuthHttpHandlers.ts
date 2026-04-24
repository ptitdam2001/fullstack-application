import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { AuthUseCases } from '../application/AuthUseCases.js'
import { getAuthUserId } from '../application/requireRoles.js'
import { InvalidCredentialsError } from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'
import { UnauthorizedError } from '../domain/AuthErrors.js'
import { PrismaUserRepository } from '../../user/infrastructure/PrismaUserRepository.js'
import { JwtAuthService } from './JwtAuthService.js'
import { logger } from '../../../config/logger.js'

const useCases = new AuthUseCases(new PrismaUserRepository(), new JwtAuthService())

export const login = async (_: Context, req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    return res.status(200).json(await useCases.login(email, password))
  } catch (err) {
    if (err instanceof UserNotFoundError || err instanceof InvalidCredentialsError)
      return res.status(403).json({ message: 'Invalid credentials', status: 403 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const forgotPassword = async (_: Context, __: Request, res: Response) => {
  return res.status(501).json({ message: 'Not implemented', status: 501 })
}

export const logout = async (_: Context, __: Request, res: Response) => {
  return res.status(200).send()
}

export const me = async (ctx: Context, _: Request, res: Response) => {
  try {
    const userId = getAuthUserId(ctx)
    return res.status(200).json(await useCases.me(userId))
  } catch (err) {
    if (err instanceof UnauthorizedError) return res.status(401).json({ message: 'Unauthorized', status: 401 })
    if (err instanceof UserNotFoundError) return res.status(404).json({ message: 'User not found', status: 404 })
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
