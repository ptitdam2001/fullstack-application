import { afterEach, describe, expect, it, vi } from 'vitest'
import { JwtAuthService } from './JwtAuthService.js'

describe('JwtAuthService', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws when JWT_SECRET is missing', () => {
    vi.stubEnv('JWT_SECRET', '')
    expect(() => new JwtAuthService()).toThrow(/JWT_SECRET/)
  })

  it('throws when JWT_SECRET is shorter than 16 characters', () => {
    vi.stubEnv('JWT_SECRET', 'short')
    expect(() => new JwtAuthService()).toThrow(/JWT_SECRET/)
  })

  it('throws when JWT_SECRET is the .env.sample placeholder', () => {
    vi.stubEnv('JWT_SECRET', 'mySecret')
    expect(() => new JwtAuthService()).toThrow(/JWT_SECRET/)
  })

  it('accepts a long enough, non-placeholder secret', () => {
    vi.stubEnv('JWT_SECRET', 'functional-test-secret')
    expect(() => new JwtAuthService()).not.toThrow()
  })
})
