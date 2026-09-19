import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createRequestLogger, sanitizePath } from './requestLogger'

const OBJECT_ID = '64b7f3c2a1d4e5f607182930'
const UUID = '3f2b8c1e-9d4a-4e7b-a1c5-0b6d2f8e7a90'

describe('sanitizePath', () => {
  it.each([
    ['/users', '/users'],
    [`/users/${OBJECT_ID}`, '/users/:id'],
    [`/team/${OBJECT_ID}/player/${OBJECT_ID.toUpperCase()}`, '/team/:id/player/:id'],
    [`/game/${UUID}`, '/game/:id'],
    ['/users?email=alice@example.com', '/users'],
    [`/teams/${OBJECT_ID}/join-requests?status=PENDING`, '/teams/:id/join-requests'],
    ['/championships?page=2', '/championships'],
  ])('%s -> %s', (input, expected) => {
    expect(sanitizePath(input)).toBe(expected)
  })
})

describe('createRequestLogger (spec 10, Sécurité › Logs)', () => {
  const logOneRequest = async () => {
    const lines: string[] = []
    const app = express()
    app.use(createRequestLogger({ write: line => lines.push(line) }))
    app.get('/users/:id', (_req, res) => res.status(200).json({ ok: true }))

    await request(app)
      .get(`/users/${OBJECT_ID}?email=alice@example.com`)
      .set('User-Agent', 'SecretBrowser/9.9')
      .set('Referer', 'https://intranet.example/private')
      .set('X-Forwarded-For', '203.0.113.7')
    return lines
  }

  it('logs method, sanitized path, status and duration', async () => {
    const lines = await logOneRequest()
    expect(lines).toHaveLength(1)
    expect(lines[0]).toMatch(/^GET \/users\/:id 200 .*\d+(\.\d+)? ms\s*$/)
  })

  it.each([
    ['the client IP (direct)', '127.0.0.1'],
    ['the client IP (IPv6-mapped)', '::ffff'],
    ['the forwarded IP', '203.0.113.7'],
    ['the user-agent', 'SecretBrowser'],
    ['the referer', 'intranet.example'],
    ['the query string', 'alice'],
    ['the query string domain', 'example.com'],
    ['the object id', OBJECT_ID],
  ])('never logs %s', async (_label, secret) => {
    const [line] = await logOneRequest()
    expect(line).not.toContain(secret)
  })
})
