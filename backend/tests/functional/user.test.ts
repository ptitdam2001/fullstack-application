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
  id: randomUUID(),
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

  describe('getUsers — pagination & filters', () => {
    const seedUsers = async (n: number) => {
      for (let i = 0; i < n; i++) {
        await createUser()
      }
    }

    it('without page nor limit returns every user (opt-in pagination)', async () => {
      await seedUsers(24)
      const admin = await createAdmin()

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(25)
    })

    it('paginates with a zero-based page and no overlap between pages', async () => {
      await seedUsers(4)
      const admin = await createAdmin()

      const first = await agent.get('/users?page=0&limit=2').set(authHeaderFor(admin.id, true))
      const second = await agent.get('/users?page=1&limit=2').set(authHeaderFor(admin.id, true))
      const last = await agent.get('/users?page=2&limit=2').set(authHeaderFor(admin.id, true))

      expect(first.body).toHaveLength(2)
      expect(second.body).toHaveLength(2)
      expect(last.body).toHaveLength(1)
      const ids = [...first.body, ...second.body, ...last.body].map((u: { id: string }) => u.id)
      expect(new Set(ids).size).toBe(5)
    })

    it('limit alone defaults page to 0', async () => {
      await seedUsers(3)
      const admin = await createAdmin()

      const res = await agent.get('/users?limit=2').set(authHeaderFor(admin.id, true))

      expect(res.body).toHaveLength(2)
    })

    it('caps limit at 100', async () => {
      await seedUsers(101)
      const admin = await createAdmin()

      const res = await agent.get('/users?page=0&limit=500').set(authHeaderFor(admin.id, true))

      expect(res.body).toHaveLength(100)
    })

    it('filters by isActive', async () => {
      const pending = await createUser({ isActive: false })
      const admin = await createAdmin()

      const res = await agent.get('/users?isActive=false').set(authHeaderFor(admin.id, true))

      expect(res.body.map((u: { id: string }) => u.id)).toEqual([pending.id])
    })
  })

  describe('countUsers — GET /users/count', () => {
    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/users/count')

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()

      const res = await agent.get('/users/count').set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin counts all users', async () => {
      await createUser()
      await createUser({ isActive: false })
      const admin = await createAdmin()

      const res = await agent.get('/users/count').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toBe(3)
    })

    it('filters by isActive', async () => {
      await createUser({ isActive: false })
      await createUser({ isActive: false })
      const admin = await createAdmin()

      const inactive = await agent.get('/users/count?isActive=false').set(authHeaderFor(admin.id, true))
      const active = await agent.get('/users/count?isActive=true').set(authHeaderFor(admin.id, true))

      expect(inactive.body).toBe(2)
      expect(active.body).toBe(1)
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

      const res = await agent
        .patch(`/user/${user.id}`)
        .set(authHeaderFor(admin.id, true))
        .send({ firstName: 'Renamed' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, firstName: 'Renamed' })
    })

    it('admin promotes a user to admin', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(admin.id, true)).send({ isAdmin: true })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, isAdmin: true, roles: expect.arrayContaining(['ADMIN']) })
    })

    it('admin revokes the admin role of another admin', async () => {
      const other = await createAdmin()
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${other.id}`).set(authHeaderFor(admin.id, true)).send({ isAdmin: false })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: other.id, isAdmin: false })
    })

    it('403 — admin revoking their own admin role, left unchanged', async () => {
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${admin.id}`).set(authHeaderFor(admin.id, true)).send({ isAdmin: false })

      expect(res.status).toBe(403)
      const stored = await prisma.user.findUnique({ where: { id: admin.id }, select: { isAdmin: true } })
      expect(stored?.isAdmin).toBe(true)
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
