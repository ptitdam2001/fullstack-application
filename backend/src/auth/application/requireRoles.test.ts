import { describe, it, expect } from 'vitest'
import { requireRoles, getAuthUserId } from './requireRoles.js'
import { Role } from '../../user/domain/User.js'
import { ForbiddenError, UnauthorizedError } from '../domain/AuthErrors.js'
import type { Context } from 'openapi-backend'

function makeCtx(jwtAuth?: object): Context {
  return { security: { jwtAuth } } as unknown as Context
}

describe('requireRoles', () => {
  it('passes when role matches', () => {
    const ctx = makeCtx({ data: 'user-1', role: Role.ADMIN })
    expect(() => requireRoles(ctx, Role.ADMIN)).not.toThrow()
  })

  it('passes when role is in the allowed list', () => {
    const ctx = makeCtx({ data: 'user-1', role: Role.COACH })
    expect(() => requireRoles(ctx, Role.ADMIN, Role.COACH)).not.toThrow()
  })

  it('throws ForbiddenError when role is not allowed', () => {
    const ctx = makeCtx({ data: 'user-1', role: Role.REFEREE })
    expect(() => requireRoles(ctx, Role.ADMIN)).toThrow(ForbiddenError)
  })

  it('throws UnauthorizedError when security payload is missing', () => {
    const ctx = makeCtx(undefined)
    expect(() => requireRoles(ctx, Role.ADMIN)).toThrow(UnauthorizedError)
  })
})

describe('getAuthUserId', () => {
  it('returns userId from token payload', () => {
    const ctx = makeCtx({ data: 'user-42', role: Role.COACH })
    expect(getAuthUserId(ctx)).toBe('user-42')
  })

  it('throws UnauthorizedError when payload is absent', () => {
    const ctx = makeCtx(undefined)
    expect(() => getAuthUserId(ctx)).toThrow(UnauthorizedError)
  })
})
