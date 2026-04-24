import type { Context } from 'openapi-backend'
import type { TokenPayload } from '../domain/User.js'
import { ForbiddenError, UnauthorizedError } from '../domain/AuthErrors.js'

export function getAuthPayload(ctx: Context): TokenPayload {
  const payload = ctx.security?.jwtAuth as TokenPayload | undefined
  if (!payload?.userId) throw new UnauthorizedError()
  return payload
}

export function requireAdmin(ctx: Context): void {
  const payload = getAuthPayload(ctx)
  if (!payload.isAdmin) throw new ForbiddenError()
}

export function getAuthUserId(ctx: Context): string {
  return getAuthPayload(ctx).userId
}
