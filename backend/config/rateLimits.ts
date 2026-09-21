import type { Express, Request } from 'express'
import { rateLimit, type Options } from 'express-rate-limit'

const MINUTE = 60 * 1000
const FIFTEEN_MINUTES = 15 * MINUTE
const HOUR = 60 * MINUTE

// A missing or invalid value (empty, non-numeric, zero, negative, fractional) falls back to the default.
const limitFromEnv = (name: string, fallback: number): number => {
  const value = Number(process.env[name])
  return Number.isInteger(value) && value > 0 ? value : fallback
}

const limiter = (limit: number, windowMs: number, message: string, extra: Partial<Options> = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: 429, message },
    ...extra,
  })

// Address read from the body, normalised so `Alice@x.com ` and `alice@x.com` share one quota.
const normalizedEmail = (req: Request): string | undefined => {
  const email: unknown = req.body?.email
  if (typeof email !== 'string') {
    return undefined
  }
  const normalized = email.trim().toLowerCase()
  return normalized === '' ? undefined : normalized
}

/**
 * Rate limits on the public auth routes (spec 10, Limitation de débit). Counters are in memory and
 * per API instance. Each `app.post([...])` shares one counter between its routes. Must be mounted
 * after `express.json()` (the email limit reads the body) and before the OpenAPI handler.
 */
export const applyAuthRateLimits = (app: Express): void => {
  app.post(
    '/login',
    limiter(limitFromEnv('LOGIN_RATE_LIMIT', 10), FIFTEEN_MINUTES, 'Too many login attempts, please try again later.')
  )
  app.post(
    '/register',
    limiter(limitFromEnv('REGISTER_RATE_LIMIT', 5), HOUR, 'Too many registration attempts, please try again later.')
  )

  // These two routes trigger an email: limit per client IP and per address, so a victim's mailbox
  // cannot be flooded from many IPs.
  const emailLimit = limitFromEnv('EMAIL_RATE_LIMIT', 5)
  const emailMessage = 'Too many requests, please try again later.'
  app.post(
    ['/forgot-password', '/resend-activation'],
    limiter(emailLimit, HOUR, emailMessage, { identifier: 'email-ip' }),
    limiter(emailLimit, HOUR, emailMessage, {
      identifier: 'email-address',
      skip: req => normalizedEmail(req) === undefined,
      keyGenerator: req => normalizedEmail(req) ?? '',
    })
  )

  app.post(
    ['/activate', '/reset-password'],
    limiter(limitFromEnv('TOKEN_RATE_LIMIT', 10), FIFTEEN_MINUTES, 'Too many requests, please try again later.')
  )
}
