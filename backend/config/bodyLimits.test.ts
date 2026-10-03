import express, { type Express } from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { applyBodyLimits, AVATAR_BODY_LIMIT_BYTES } from './bodyLimits'

const DEFAULT_LIMIT_BYTES = 100 * 1024

// Mini app mirroring createApp: route limits first, then the global parser.
const buildApp = (): Express => {
  const app = express()
  applyBodyLimits(app)
  app.use(express.json())
  app.put('/me/avatar', (req, res) => {
    res.status(200).json({ length: req.body.data.length })
  })
  app.post('/other', (req, res) => {
    res.status(200).json({ length: req.body.data.length })
  })
  return app
}

const bodyOf = (bytes: number) => ({ data: 'A'.repeat(bytes) })

describe('applyBodyLimits', () => {
  it('lets PUT /me/avatar carry a body above the default limit', async () => {
    const res = await request(buildApp())
      .put('/me/avatar')
      .send(bodyOf(DEFAULT_LIMIT_BYTES + 10_000))
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(DEFAULT_LIMIT_BYTES + 10_000)
  })

  it('answers 400 on PUT /me/avatar above its own limit', async () => {
    const res = await request(buildApp()).put('/me/avatar').send(bodyOf(AVATAR_BODY_LIMIT_BYTES))
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ status: 400, message: 'The image is too large' })
  })

  it('leaves the default limit on the other routes', async () => {
    const res = await request(buildApp())
      .post('/other')
      .send(bodyOf(DEFAULT_LIMIT_BYTES + 10_000))
    expect(res.status).toBe(413)
  })

  it('passes other parse errors on untouched', async () => {
    const res = await request(buildApp()).put('/me/avatar').set('Content-Type', 'application/json').send('{not json')
    expect(res.status).toBe(400)
    expect(res.body).not.toEqual({ status: 400, message: 'The image is too large' })
  })
})
