import type { Context } from 'openapi-backend'
import { Role } from '../../user/domain/User.js'
import type { TokenPayload } from '../domain/User.js'
import { ForbiddenError, UnauthorizedError } from '../domain/AuthErrors.js'

export function requireRoles(ctx: Context, ...roles: Role[]): void {
  const payload = ctx.security?.jwtAuth as TokenPayload | undefined
  if (!payload?.data) throw new UnauthorizedError()
  if (!roles.includes(payload.role as Role)) throw new ForbiddenError()
}

export function getAuthUserId(ctx: Context): string {
  const payload = ctx.security?.jwtAuth as TokenPayload | undefined
  if (!payload?.data) throw new UnauthorizedError()
  return payload.data
}
