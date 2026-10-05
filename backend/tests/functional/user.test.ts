import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { TeamRole } from '@prisma/client'
import { assignUserToTeam, createAdmin, createTeam, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

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

  describe('getUsers — contextual roles', () => {
    const rolesOf = (body: { id: string; roles: string[] }[], id: string) => body.find(u => u.id === id)?.roles

    it('derives COACH and PLAYER from team memberships', async () => {
      const admin = await createAdmin()
      const team = await createTeam()
      const coach = await createUser()
      const player = await createUser()
      const both = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)
      await assignUserToTeam(player.id, team.id, TeamRole.PLAYER)
      await assignUserToTeam(both.id, team.id, TeamRole.COACH)
      await assignUserToTeam(both.id, team.id, TeamRole.PLAYER)

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(rolesOf(res.body, admin.id)).toEqual(['ADMIN'])
      expect(rolesOf(res.body, coach.id)).toEqual(['COACH'])
      expect(rolesOf(res.body, player.id)).toEqual(['PLAYER'])
      expect(rolesOf(res.body, both.id)).toEqual(expect.arrayContaining(['COACH', 'PLAYER']))
      expect(rolesOf(res.body, both.id)).toHaveLength(2)
    })

    it('lists a role once even when held in several teams', async () => {
      const admin = await createAdmin()
      const coach = await createUser()
      await assignUserToTeam(coach.id, (await createTeam()).id, TeamRole.COACH)
      await assignUserToTeam(coach.id, (await createTeam()).id, TeamRole.COACH)

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(rolesOf(res.body, coach.id)).toEqual(['COACH'])
    })

    it('derives REFEREE from match assignments without the isReferee flag', async () => {
      const admin = await createAdmin()
      const referee = await createUser({ isReferee: false })
      const match = await prisma.match.create({ data: {} })
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(rolesOf(res.body, referee.id)).toEqual(['REFEREE'])
    })

    it('derives REFEREE from the isReferee flag without match assignments', async () => {
      const admin = await createAdmin()
      const referee = await createUser({ isReferee: true })

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(rolesOf(res.body, referee.id)).toEqual(['REFEREE'])
    })

    it('lists REFEREE once when both flagged and assigned to a match', async () => {
      const admin = await createAdmin()
      const referee = await createUser({ isReferee: true })
      const match = await prisma.match.create({ data: {} })
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })

      const res = await agent.get('/users').set(authHeaderFor(admin.id, true))

      expect(rolesOf(res.body, referee.id)).toEqual(['REFEREE'])
    })

    it('GET /users/{id} returns the same contextual roles', async () => {
      const admin = await createAdmin()
      const coach = await createUser()
      await assignUserToTeam(coach.id, (await createTeam()).id, TeamRole.COACH)

      const res = await agent.get(`/users/${coach.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body.roles).toEqual(['COACH'])
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

  describe('POST /user — removed', () => {
    // Accounts are only created via /register + admin activation (spec 06, note ³)
    it('404 — admin cannot create a user directly', async () => {
      const admin = await createAdmin()

      const res = await agent
        .post('/user')
        .set(authHeaderFor(admin.id, true))
        .send({ email: 'created@fixtures.local', firstName: 'Created', password: 'Test@1234' })

      expect(res.status).toBe(404)
      expect(await prisma.user.count({ where: { email: 'created@fixtures.local' } })).toBe(0)
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

    it('règle métier: lastName null clears the last name', async () => {
      const user = await createUser({ lastName: 'Durand' })
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(admin.id, true)).send({ lastName: null })

      expect(res.status).toBe(200)
      expect(res.body.lastName ?? null).toBeNull()
      const stored = await prisma.user.findUnique({
        where: { id: user.id },
        select: { lastName: true, firstName: true },
      })
      expect(stored).toEqual({ lastName: null, firstName: user.firstName })
    })

    it.each([[''], ['   ']])('400 — lastName %j is refused, left unchanged', async lastName => {
      const user = await createUser({ lastName: 'Durand' })
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(admin.id, true)).send({ lastName })

      expect(res.status).toBe(400)
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { lastName: true } })
      expect(stored?.lastName).toBe('Durand')
    })

    it('400 — a blank firstName is refused, left unchanged', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.patch(`/user/${user.id}`).set(authHeaderFor(admin.id, true)).send({ firstName: '   ' })

      expect(res.status).toBe(400)
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { firstName: true } })
      expect(stored?.firstName).toBe(user.firstName)
    })

    it('400 — avatar is not a field of this route: an admin cannot choose a photo', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent
        .patch(`/user/${user.id}`)
        .set(authHeaderFor(admin.id, true))
        .send({ avatar: 'https://example.test/picture.png' })

      expect(res.status).toBe(400)
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { avatar: true } })
      expect(stored?.avatar ?? null).toBeNull()
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

  describe('removeUserAvatar — DELETE /user/{id}/avatar', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0])
    const seedAvatar = async (ownerId: string, publicId: string) => {
      const image = await prisma.image.create({
        data: { publicId, data: jpeg, contentType: 'image/jpeg', size: jpeg.length, ownerId },
      })
      await prisma.user.update({ where: { id: ownerId }, data: { avatar: `/images/${publicId}` } })
      return image
    }

    it('401 — unauthenticated request', async () => {
      const user = await createUser()

      const res = await agent.delete(`/user/${user.id}/avatar`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user, photo left in place', async () => {
      const user = await createUser()
      const other = await createUser()
      const image = await seedAvatar(user.id, 'a'.repeat(22))

      const res = await agent.delete(`/user/${user.id}/avatar`).set(authHeaderFor(other.id))

      expect(res.status).toBe(403)
      expect(await prisma.image.findUnique({ where: { id: image.id } })).not.toBeNull()
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { avatar: true } })
      expect(stored?.avatar).toBe(`/images/${image.publicId}`)
    })

    it('nominal: admin removes the photo of a user — pointer and stored image, and only theirs', async () => {
      const user = await createUser()
      const other = await createUser()
      const admin = await createAdmin()
      const image = await seedAvatar(user.id, 'a'.repeat(22))
      const otherImage = await seedAvatar(other.id, 'b'.repeat(22))

      const res = await agent.delete(`/user/${user.id}/avatar`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, email: user.email })
      expect(res.body.avatar ?? null).toBeNull()
      expect(res.body).not.toHaveProperty('password')
      const stored = await prisma.user.findUnique({ where: { id: user.id }, select: { avatar: true } })
      expect(stored?.avatar).toBeNull()
      expect(await prisma.image.findUnique({ where: { id: image.id } })).toBeNull()
      expect(await prisma.image.findUnique({ where: { id: otherImage.id } })).not.toBeNull()
      expect((await agent.get(`/images/${image.publicId}`)).status).toBe(404)
    })

    it('idempotent: 200 when the user has no photo', async () => {
      const user = await createUser()
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${user.id}/avatar`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body.avatar ?? null).toBeNull()
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${unknownObjectId()}/avatar`).set(authHeaderFor(admin.id, true))

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

    it('règle métier: deleting a user deletes their stored images, and only theirs', async () => {
      const user = await createUser()
      const other = await createUser()
      const admin = await createAdmin()
      const data = Buffer.from([0xff, 0xd8, 0xff, 0xe0])
      const image = await prisma.image.create({
        data: { publicId: 'a'.repeat(22), data, contentType: 'image/jpeg', size: data.length, ownerId: user.id },
      })
      const otherImage = await prisma.image.create({
        data: { publicId: 'b'.repeat(22), data, contentType: 'image/jpeg', size: data.length, ownerId: other.id },
      })
      await prisma.user.update({ where: { id: user.id }, data: { avatar: `/images/${image.publicId}` } })

      const res = await agent.delete(`/user/${user.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      expect(await prisma.image.findUnique({ where: { id: image.id } })).toBeNull()
      expect((await agent.get(`/images/${image.publicId}`)).status).toBe(404)
      expect(await prisma.image.findUnique({ where: { id: otherImage.id } })).not.toBeNull()
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })

    it('403 — admin cannot delete their own account', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/user/${admin.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(403)
      const stored = await prisma.user.findUnique({ where: { id: admin.id } })
      expect(stored).not.toBeNull()
    })
  })
})
