import type { Request, Response } from 'express'
import type { Context } from 'openapi-backend'
import { ProfileUseCases } from '../application/ProfileUseCases.js'
import { InvalidAvatarError, UserNotFoundError, type InvalidAvatarReason } from '../domain/UserErrors.js'
import { MAX_AVATAR_BYTES } from '../domain/Avatar.js'
import { PrismaUserRepository } from './PrismaUserRepository.js'
import { PrismaImageStorage } from '../../image/infrastructure/PrismaImageStorage.js'
import { getAuthUserId } from '../../auth/application/requireRoles.js'
import { UnauthorizedError } from '../../auth/domain/AuthErrors.js'
import { logger } from '../../../config/logger.js'

const useCases = new ProfileUseCases(new PrismaUserRepository(), new PrismaImageStorage())

const AVATAR_ERROR_MESSAGES: Record<InvalidAvatarReason, string> = {
  INVALID_ENCODING: 'The image is not valid base64',
  EMPTY: 'The image is empty',
  TOO_LARGE: `The image exceeds ${MAX_AVATAR_BYTES / 1024} kB`,
  UNSUPPORTED_TYPE: 'Only JPEG, PNG and WebP images are accepted',
  CONTENT_MISMATCH: 'The image content does not match its declared type',
}

const handleError = (err: unknown, res: Response) => {
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ message: 'Unauthorized', status: 401 })
  }
  if (err instanceof UserNotFoundError) {
    return res.status(404).json({ message: 'User not found', status: 404 })
  }
  if (err instanceof InvalidAvatarError) {
    return res.status(400).json({ message: AVATAR_ERROR_MESSAGES[err.reason], status: 400 })
  }
  logger.error(err)
  return res.status(500).json({ message: 'Error! Something went wrong.', status: 500 })
}

export const updateMyProfile = async (ctx: Context, req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body
    return res.status(200).json(await useCases.updateProfile(getAuthUserId(ctx), { firstName, lastName }))
  } catch (err) {
    return handleError(err, res)
  }
}

export const updateMyAvatar = async (ctx: Context, req: Request, res: Response) => {
  try {
    const { contentType, data } = req.body
    return res.status(200).json(await useCases.updateAvatar(getAuthUserId(ctx), { contentType, data }))
  } catch (err) {
    return handleError(err, res)
  }
}

export const removeMyAvatar = async (ctx: Context, _: Request, res: Response) => {
  try {
    return res.status(200).json(await useCases.removeAvatar(getAuthUserId(ctx)))
  } catch (err) {
    return handleError(err, res)
  }
}
