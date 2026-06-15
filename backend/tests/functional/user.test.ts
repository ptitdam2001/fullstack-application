import { randomBytes, randomUUID } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

const userInput = (overrides: Partial<Record<string, unknown>> = {}) => ({
  _id: randomUUID(),
  email: `new-${randomUUID()}@fixtures.local`,
  firstName: 'New',
  lastName: 'User',
  isAdmin: false,
  isActive: false,
  isBlocked: false,
  isReferee: false,
  password: 'Test@1234',
  ...overrides,
})

describe('user domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('getUsers — GET /users', () => {
    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/users')

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()

      const res = await agent.get('/users').set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin lists all users', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: user.id }), expect.objectContaining({ id: admin.id })])
      )
    })
  })

  describe('createUser — POST /user', () => {
    it('401 — unauthenticated request', async () => {
      const res = await agent.post('/user').send(userInput())

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()

      const res = await agent.post('/user').set(authHeaderFor(user.id)).send(userInput())

      expect(res.status).toBe(403)
    })

    it('nominal: admin creates a user with a hashed password', async () => {
      const admin = await createAdmin()
      const input = userInput({ email: 'created@fixtures.local', firstName: 'Created' })

      const res = await agent.post('/user').set(authHeaderFor(admin.id, true)).send(input)

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ email: 'created@fixtures.local', firstName: 'Created', isAdmin: false })

      const stored = await prisma.user.findUnique({ where: { id: res.body.id } })
      expect(stored?.password).not.toBe('Test@1234')
    })
  })

  describe('getUser — GET /users/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const user = await createUser()

      const res = await agent.get(`/users/${user.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const other = await createUser()

      const res = await agent.get(`/users/${user.id}`).set(authHeaderFor(other.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin returns a user by id', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.get(`/users/${user.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, email: user.email })
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.get(`/users/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })
  })

  describe('updateUser — PATCH /user/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const user = await createUser()

      const res = await agent.patch(`/user/${user.id}`).send({ firstName: 'Renamed' })

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const other = await createUser()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(other.id)).send({ firstName: 'Renamed' })

      expect(res.status).toBe(403)
    })

    it('nominal: admin updates a user', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(admin.id, true)).send({ firstName: 'Renamed' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, firstName: 'Renamed' })
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent
        .patch(`/user/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send({ firstName: 'Renamed' })

      expect(res.status).toBe(404)
    })
  })

  describe('removeUser — DELETE /user/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const user = await createUser()

      const res = await agent.delete(`/user/${user.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const other = await createUser()

      const res = await agent.delete(`/user/${user.id}`).set(authHeaderFor(other.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin deletes a user', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${user.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.user.findUnique({ where: { id: user.id } })
      expect(stored).toBeNull()
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })
  })
})
