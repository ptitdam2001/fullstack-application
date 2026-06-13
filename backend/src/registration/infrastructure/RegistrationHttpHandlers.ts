import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { RegistrationUseCases } from '../application/RegistrationUseCases.js'
import { getAuthUserId, requireAdmin } from '../../auth/application/requireRoles.js'
import { EmailAlreadyUsedError, InvalidTokenError } from '../domain/RegistrationErrors.js'
import { UnauthorizedError, ForbiddenError } from '../../auth/domain/AuthErrors.js'
import { UserNotFoundError } from '../../user/domain/UserErrors.js'
import { PrismaRegistrationRepository } from './PrismaRegistrationRepository.js'
import { NoopEmailService } from './NoopEmailService.js'
import { JwtAuthService } from '../../auth/infrastructure/JwtAuthService.js'
import { logger } from '../../../config/logger.js'

const useCases = new RegistrationUseCases(
  new PrismaRegistrationRepository(),
  new NoopEmailService(),
  new JwtAuthService()
)

export const register = async (_: Context, req: Request, res: Response) => {
  try {
    const user = await useCases.register(req.body)
    const { activationTokenExpiry: _, resetTokenExpiry: __, ...publicUser } = user
    return res.status(201).json({ ...publicUser, roles: [] })
  } catch (err) {
    if (err instanceof EmailAlreadyUsedError) {
      return res.status(409).json({ message: 'Email already in use', status: 409 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const activateAccount = async (_: Context, req: Request, res: Response) => {
  try {
    await useCases.activateAccount(req.body.token)
    return res.status(200).send()
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return res.status(400).json({ message: 'Token invalide ou expiré', status: 400 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const resendActivation = async (_: Context, req: Request, res: Response) => {
  try {
    await useCases.resendActivation(req.body.email)
    return res.status(200).send()
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const forgotPassword = async (_: Context, req: Request, res: Response) => {
  try {
    await useCases.forgotPassword(req.body.email)
    return res.status(200).send()
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const resetPassword = async (_: Context, req: Request, res: Response) => {
  try {
    await useCases.resetPassword(req.body.token, req.body.newPassword)
    return res.status(200).send()
  } catch (err) {
    if (err instanceof InvalidTokenError) {
      return res.status(400).json({ message: 'Token invalide ou expiré', status: 400 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const declareReferee = async (ctx: Context, _: Request, res: Response) => {
  try {
    const userId = getAuthUserId(ctx)
    await useCases.declareReferee(userId)
    return res.status(200).send()
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const adminActivateUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    await useCases.adminActivateUser(ctx.request.params.userId as string)
    return res.status(200).send()
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}

export const adminUnblockUser = async (ctx: Context, _: Request, res: Response) => {
  try {
    requireAdmin(ctx)
    await useCases.adminUnblockUser(ctx.request.params.userId as string)
    return res.status(200).send()
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return res.status(401).json({ message: 'Unauthorized', status: 401 })
    }
    if (err instanceof ForbiddenError) {
      return res.status(403).json({ message: 'Forbidden', status: 403 })
    }
    if (err instanceof UserNotFoundError) {
      return res.status(404).json({ message: 'User not found', status: 404 })
    }
    logger.error(err)
    return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
  }
}