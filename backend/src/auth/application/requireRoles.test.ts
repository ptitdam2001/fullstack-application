import { describe, it, expect } from 'vitest'
import { requireAdmin, getAuthPayload, getAuthUserId } from './requireRoles.js'
import { ForbiddenError, UnauthorizedError } from '../domain/AuthErrors.js'
import type { Context } from 'openapi-backend'

function makeCtx(jwtAuth?: object): Context {
  return { security: { jwtAuth } } as unknown as Context
}

describe('requireAdmin', () => {
  it('passes when user is admin', () => {
    const ctx = makeCtx({ userId: 'user-1', isAdmin: true })
    expect(() => requireAdmin(ctx)).not.toThrow()
  })

  it('throws ForbiddenError when user is not admin', () => {
    const ctx = makeCtx({ userId: 'user-1', isAdmin: false })
    expect(() => requireAdmin(ctx)).toThrow(ForbiddenError)
  })

  it('throws UnauthorizedError when security payload is missing', () => {
    const ctx = makeCtx(undefined)
    expect(() => requireAdmin(ctx)).toThrow(UnauthorizedError)
  })
})

describe('getAuthPayload', () => {
  it('returns payload when present', () => {
    const ctx = makeCtx({ userId: 'user-42', isAdmin: false })
    const payload = getAuthPayload(ctx)
    expect(payload.userId).toBe('user-42')
    expect(payload.isAdmin).toBe(false)
  })

  it('throws UnauthorizedError when payload is absent', () => {
    const ctx = makeCtx(undefined)
    expect(() => getAuthPayload(ctx)).toThrow(UnauthorizedError)
  })
})

describe('getAuthUserId', () => {
  it('returns userId from token payload', () => {
    const ctx = makeCtx({ userId: 'user-42', isAdmin: false })
    expect(getAuthUserId(ctx)).toBe('user-42')
  })

  it('throws UnauthorizedError when payload is absent', () => {
    const ctx = makeCtx(undefined)
    expect(() => getAuthUserId(ctx)).toThrow(UnauthorizedError)
  })
})
