import supertest from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp } from '../../createApp'
import { resetDatabase } from '../support/database.js'

// Wiring check on the real app (spec 10, Limitation de débit): the limiter behaviour itself
// (keys, shared quotas, defaults) is covered by config/rateLimits.test.ts.
const email = 'rate-limit@fixtures.local'

const routes: Array<[string, string, object, string]> = [
  ['POST /login', '/login', { email, password: 'Whatever123' }, 'LOGIN_RATE_LIMIT'],
  ['POST /register', '/register', { firstName: 'Rate', email, password: 'Password123' }, 'REGISTER_RATE_LIMIT'],
  ['POST /forgot-password', '/forgot-password', { email }, 'EMAIL_RATE_LIMIT'],
  ['POST /resend-activation', '/resend-activation', { email }, 'EMAIL_RATE_LIMIT'],
  ['POST /activate', '/activate', { token: 'not-a-real-token' }, 'TOKEN_RATE_LIMIT'],
  [
    'POST /reset-password',
    '/reset-password',
    { token: 'not-a-real-token', newPassword: 'Password123' },
    'TOKEN_RATE_LIMIT',
  ],
]

describe('rate limiting — functional API', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it.each(routes)('%s answers 429 once its limit is reached', async (_label, path, body, envName) => {
    vi.stubEnv(envName, '1')
    const agent = supertest(await createApp())

    const first = await agent.post(path).send(body)
    const second = await agent.post(path).send(body)

    expect(first.status).not.toBe(429)
    expect(second.status).toBe(429)
    expect(second.body).toMatchObject({ status: 429 })
  })

  it('does not rate limit an unrelated route', async () => {
    vi.stubEnv('TOKEN_RATE_LIMIT', '1')
    vi.stubEnv('EMAIL_RATE_LIMIT', '1')
    const agent = supertest(await createApp())

    const results = [await agent.get('/health'), await agent.get('/health'), await agent.get('/health')]

    expect(results.map(res => res.status)).toEqual([200, 200, 200])
  })
})
