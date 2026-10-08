import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createUser } from '../support/fixtures.js'

// The answers `openapi-backend` gives before any handler runs (issue #64): all in the `ErrorOutput`
// shape of openapi.yml, `{ status, message }`, where `status` is the HTTP status of the answer.
describe('error format of the router — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('400 — a payload that breaks the schema, with the validation errors', async () => {
    const res = await agent.post('/login').send({ email: 'someone@example.com' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ status: 400, message: 'Invalid request', errors: expect.any(Array) })
    expect(res.body.errors).not.toHaveLength(0)
  })

  it('401 — a protected route without a token', async () => {
    const res = await agent.get('/me')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ status: 401, message: 'Unauthorized' })
  })

  it('404 — a path outside the contract', async () => {
    const res = await agent.get('/no-such-route')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ status: 404, message: 'Not found' })
  })

  it('405 — a method the path does not declare', async () => {
    const res = await agent.delete('/login')

    expect(res.status).toBe(405)
    expect(res.body).toEqual({ status: 405, message: 'Method not allowed' })
  })

  it('501 — an operation of the contract without a handler', async () => {
    const user = await createUser()

    const res = await agent.get('/games').set(authHeaderFor(user.id))

    expect(res.status).toBe(501)
    expect(res.body).toEqual({ status: 501, message: 'Not implemented' })
  })
})
