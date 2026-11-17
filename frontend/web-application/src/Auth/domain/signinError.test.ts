import { describe, expect, it } from 'vitest'
import { getSigninErrorKey } from './signinError'

const httpError = (status: number, data?: object) => ({ response: { status, data } })

describe('getSigninErrorKey', () => {
  it('reports a rate-limited sign-in as too many attempts', () => {
    expect(getSigninErrorKey(httpError(429))).toBe('auth.error.tooManyRequests')
  })

  it('reads the reason of a 403, not its message', () => {
    expect(getSigninErrorKey(httpError(403, { reason: 'ACCOUNT_INACTIVE', message: 'Compte bloqué' }))).toBe(
      'auth.error.accountInactive'
    )
    expect(getSigninErrorKey(httpError(403, { reason: 'ACCOUNT_BLOCKED', message: 'Compte non activé' }))).toBe(
      'auth.error.accountBlocked'
    )
  })

  it('reports a 403 without a known reason as blocked: blocked wins over inactive on the API side', () => {
    expect(getSigninErrorKey(httpError(403))).toBe('auth.error.accountBlocked')
  })

  it.each([
    ['a 401', httpError(401)],
    ['a network error without response', new Error('Network Error')],
    ['undefined', undefined],
  ])('reports %s as invalid credentials', (_label, err) => {
    expect(getSigninErrorKey(err)).toBe('auth.error.invalidCredentials')
  })
})
