import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { logger } from '../../config/logger.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'

const DEFAULT_LIMIT_BYTES = 100 * 1024

// A body `express.json()` cannot read is the caller's mistake (issue #53): answered in the
// `ErrorOutput` shape, on any route, ahead of authentication and validation, without an error log.
// The parser rejects these requests before any handler runs: no fixture, no database reset.
describe('unreadable request body — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('answers 400 to malformed JSON on a public route', async () => {
    const errorLog = vi.spyOn(logger, 'error')
    const warnLog = vi.spyOn(logger, 'warn')

    const res = await agent.post('/login').set('Content-Type', 'application/json').send('{')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ status: 400, message: 'Malformed request body' })
    expect(errorLog).not.toHaveBeenCalled()
    expect(warnLog).toHaveBeenCalledWith('POST /login 400 - entity.parse.failed')
  })

  it('answers 413 to a body above the default limit on a normal route', async () => {
    const errorLog = vi.spyOn(logger, 'error')
    const warnLog = vi.spyOn(logger, 'warn')

    const res = await agent
      .post('/team')
      .set(authHeaderFor('000000000000000000000001'))
      .send({ name: 'A'.repeat(DEFAULT_LIMIT_BYTES + 1) })

    expect(res.status).toBe(413)
    expect(res.body).toEqual({ status: 413, message: 'Request body too large' })
    expect(errorLog).not.toHaveBeenCalled()
    expect(warnLog).toHaveBeenCalledWith('POST /team 413 - entity.too.large')
  })

  it('answers 415 to a body in an unsupported charset', async () => {
    const res = await agent.post('/login').set('Content-Type', 'application/json; charset=x-unknown').send('{}')

    expect(res.status).toBe(415)
    expect(res.body).toEqual({ status: 415, message: 'Unsupported charset' })
  })

  it('keeps the 400 of PUT /me/avatar for a picture above its own limit', async () => {
    const res = await agent
      .put('/me/avatar')
      .set(authHeaderFor('000000000000000000000001'))
      .send({ contentType: 'image/png', data: 'A'.repeat(2 * DEFAULT_LIMIT_BYTES) })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ status: 400, message: 'The image is too large' })
  })
})
