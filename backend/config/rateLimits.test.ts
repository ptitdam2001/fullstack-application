import express, { type Express } from 'express'
import request from 'supertest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyAuthRateLimits } from './rateLimits'

// Mini app: 200 on every rate-limited route. `trust proxy` = 1 hop lets a test pick the client IP
// through X-Forwarded-For, to tell the per-IP limit from the per-email one.
const buildApp = (env: Record<string, string> = {}): Express => {
  for (const [name, value] of Object.entries(env)) {
    vi.stubEnv(name, value)
  }
  const app = express()
  app.set('trust proxy', 1)
  app.use(express.json())
  applyAuthRateLimits(app)
  app.post(
    ['/login', '/register', '/forgot-password', '/resend-activation', '/activate', '/reset-password'],
    (_req, res) => {
      res.sendStatus(200)
    }
  )
  return app
}

const post = (app: Express, path: string, body: object, ip = '10.0.0.1') =>
  request(app).post(path).set('X-Forwarded-For', ip).send(body)

const statuses = async (calls: Array<() => Promise<{ status: number }>>): Promise<number[]> => {
  const result: number[] = []
  for (const call of calls) {
    result.push((await call()).status)
  }
  return result
}

describe('applyAuthRateLimits (spec 10, Limitation de débit)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('POST /forgot-password and POST /resend-activation', () => {
    it('limits per IP, whatever the email', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/forgot-password', { email: 'a@example.com' }),
        () => post(app, '/forgot-password', { email: 'b@example.com' }),
        () => post(app, '/forgot-password', { email: 'c@example.com' }),
      ])
      expect(results).toEqual([200, 200, 429])
    })

    it('limits per email address across many IPs, and leaves other addresses alone', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/forgot-password', { email: 'victim@example.com' }, '10.0.0.1'),
        () => post(app, '/forgot-password', { email: 'victim@example.com' }, '10.0.0.2'),
        () => post(app, '/forgot-password', { email: 'victim@example.com' }, '10.0.0.3'),
        () => post(app, '/forgot-password', { email: 'other@example.com' }, '10.0.0.4'),
      ])
      expect(results).toEqual([200, 200, 429, 200])
    })

    it('normalises the address (case and surrounding spaces) before counting', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/forgot-password', { email: 'Alice@Example.com' }, '10.0.0.1'),
        () => post(app, '/forgot-password', { email: ' alice@example.com ' }, '10.0.0.2'),
        () => post(app, '/forgot-password', { email: 'ALICE@EXAMPLE.COM' }, '10.0.0.3'),
      ])
      expect(results).toEqual([200, 200, 429])
    })

    it('shares one quota between the two routes', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/forgot-password', { email: 'a@example.com' }, '10.0.0.1'),
        () => post(app, '/resend-activation', { email: 'a@example.com' }, '10.0.0.2'),
        () => post(app, '/resend-activation', { email: 'a@example.com' }, '10.0.0.3'),
        () => post(app, '/forgot-password', { email: 'a@example.com' }, '10.0.0.4'),
      ])
      expect(results).toEqual([200, 200, 429, 429])
    })

    it('applies only the per-IP limit when the body has no usable address', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/forgot-password', {}),
        () => post(app, '/forgot-password', { email: '' }),
        () => post(app, '/forgot-password', { email: 42 }),
      ])
      expect(results).toEqual([200, 200, 429])
    })

    it('answers 429 the same way for an unknown address (nothing about the account is revealed)', async () => {
      const app = buildApp({ EMAIL_RATE_LIMIT: '1' })
      await post(app, '/forgot-password', { email: 'ghost@example.com' })
      const blocked = await post(app, '/forgot-password', { email: 'ghost@example.com' })
      expect(blocked.status).toBe(429)
      expect(blocked.body).toEqual({ status: 429, message: expect.any(String) })
    })

    it('defaults to 5 per hour when the variable is absent', async () => {
      const app = buildApp()
      const results = await statuses(
        Array.from({ length: 6 }, () => () => post(app, '/forgot-password', { email: 'a@example.com' }))
      )
      expect(results).toEqual([200, 200, 200, 200, 200, 429])
    })

    it.each(['abc', '0', '-3', ''])('falls back to the default when EMAIL_RATE_LIMIT is %j', async value => {
      const app = buildApp({ EMAIL_RATE_LIMIT: value })
      const results = await statuses(
        Array.from({ length: 6 }, () => () => post(app, '/forgot-password', { email: 'a@example.com' }))
      )
      expect(results).toEqual([200, 200, 200, 200, 200, 429])
    })
  })

  describe('POST /activate and POST /reset-password', () => {
    it('limits per IP with one shared quota', async () => {
      const app = buildApp({ TOKEN_RATE_LIMIT: '2' })
      const results = await statuses([
        () => post(app, '/activate', { token: 'a' }),
        () => post(app, '/reset-password', { token: 'b', newPassword: 'x' }),
        () => post(app, '/activate', { token: 'c' }),
      ])
      expect(results).toEqual([200, 200, 429])
    })

    it('counts each IP separately', async () => {
      const app = buildApp({ TOKEN_RATE_LIMIT: '1' })
      const results = await statuses([
        () => post(app, '/activate', { token: 'a' }, '10.0.0.1'),
        () => post(app, '/activate', { token: 'a' }, '10.0.0.2'),
        () => post(app, '/activate', { token: 'a' }, '10.0.0.1'),
      ])
      expect(results).toEqual([200, 200, 429])
    })

    it('defaults to 10 per 15 minutes when the variable is absent', async () => {
      const app = buildApp()
      const results = await statuses(Array.from({ length: 11 }, () => () => post(app, '/activate', { token: 'a' })))
      expect(results.slice(0, 10)).toEqual(Array(10).fill(200))
      expect(results[10]).toBe(429)
    })
  })

  describe('POST /login and POST /register (unchanged behaviour)', () => {
    it('limits /login per IP', async () => {
      const app = buildApp({ LOGIN_RATE_LIMIT: '2' })
      const body = { email: 'a@example.com', password: 'x' }
      expect(await statuses(Array.from({ length: 3 }, () => () => post(app, '/login', body)))).toEqual([200, 200, 429])
    })

    it('limits /register per IP', async () => {
      const app = buildApp({ REGISTER_RATE_LIMIT: '2' })
      const body = { firstName: 'A', email: 'a@example.com', password: 'Password123' }
      expect(await statuses(Array.from({ length: 3 }, () => () => post(app, '/register', body)))).toEqual([
        200, 200, 429,
      ])
    })
  })

  it('answers 429 with the documented body and standard RateLimit headers', async () => {
    const app = buildApp({ TOKEN_RATE_LIMIT: '1' })
    await post(app, '/activate', { token: 'a' })
    const res = await post(app, '/activate', { token: 'a' })
    expect(res.status).toBe(429)
    expect(res.body).toEqual({ status: 429, message: expect.any(String) })
    expect(res.headers['ratelimit']).toBeDefined()
  })

  it('does not limit other routes', async () => {
    const app = express()
    app.set('trust proxy', 1)
    vi.stubEnv('TOKEN_RATE_LIMIT', '1')
    app.use(express.json())
    applyAuthRateLimits(app)
    app.get('/teams', (_req, res) => {
      res.sendStatus(200)
    })
    const results = await statuses(Array.from({ length: 3 }, () => () => request(app).get('/teams')))
    expect(results).toEqual([200, 200, 200])
  })
})
