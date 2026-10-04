import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { AuthUseCases } from '../application/AuthUseCases.js'
import { getAuthUserId } from '../application/requireRoles.js'
import {
  InvalidCredentialsError,
  AccountBlockedError,
  AccountInactiveError,
  UnauthorizedError,
  WeakPasswordError,
  WrongCurrentPasswordError,
} from '../domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'
import { PrismaUserRepository } from '../../user/infrastructure/PrismaUserRepository.js'
import { JwtAuthService } from './JwtAuthService.js'
import { logger } from '../../../config/logger.js'

const useCases = new AuthUseCases(new PrismaUserRepository(), new JwtAuthService())

export const login = async (_: Context, req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    return res.status(200).json(await useCases.login(email, password))
  } catch (err) {
    if (err instanceof UserNotFoundError || err instanceof InvalidCredentialsError) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect', status: 401 })
    }
    if (err instanceof AccountInactiveError) {
      return res.status(403).json({ message: 'Compte non activé', status: 403 })
    }
    if (err instanceof AccountBlockedError) {
      return res.status(403).json({ message: 'Compte bloqué', status: 403 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const logout = async (_: Context, __: Request, res: Response) => res.status(200).send()

export const me = async (ctx: Context, _: Request, res: Response) => {
  try {
    const userId = getAuthUserId(ctx)
    return res.status(200).json(await useCases.me(userId))
  } catch (err) {
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

export const changeMyPassword = async (ctx: Context, req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body
    return res.status(200).json(await useCases.changePassword(getAuthUserId(ctx), currentPassword, newPassword))
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    // 400, not 401: the session is fine, and clients treat any 401 as "session expired". The 401 above
    // is reserved for the attempt that locks the account, which does sign every session out.
    if (err instanceof WrongCurrentPasswordError) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect', status: 400 })
    }
    if (err instanceof WeakPasswordError) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 8 caractères, 1 chiffre et 1 majuscule',
        status: 400,
      })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}
