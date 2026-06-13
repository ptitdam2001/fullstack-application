import { TeamRole } from '@prisma/client'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createTeam, createUser, FIXTURE_PASSWORD } from '../support/fixtures.js'

describe('auth domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── me ─────────────────────────────────────────────────────────────────
  describe('me — GET /me', () => {
    it('nominal: returns profile with no contextual roles for a plain user', async () => {
      const user = await createUser()
      const res = await agent.get('/me').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        isAdmin: false,
        isReferee: false,
        roles: [],
      })
    })

    it('nominal: includes ADMIN role for an admin user', async () => {
      const admin = await createAdmin()
      const res = await agent.get('/me').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body.roles).toContain('ADMIN')
    })

    it('nominal: includes REFEREE role when isReferee is set', async () => {
      const referee = await createUser({ isReferee: true })
      const res = await agent.get('/me').set(authHeaderFor(referee.id))

      expect(res.status).toBe(200)
      expect(res.body.roles).toContain('REFEREE')
    })

    it('nominal: includes COACH role when user has a COACH UserTeam', async () => {
      const team = await createTeam()
      const coach = await createUser()
      await prisma.userTeam.create({ data: { userId: coach.id, teamId: team.id, role: TeamRole.COACH } })

      const res = await agent.get('/me').set(authHeaderFor(coach.id))

      expect(res.status).toBe(200)
      expect(res.body.roles).toContain('COACH')
    })

    it('nominal: includes PLAYER role when user has a PLAYER UserTeam', async () => {
      const team = await createTeam()
      const player = await createUser()
      await prisma.userTeam.create({ data: { userId: player.id, teamId: team.id, role: TeamRole.PLAYER } })

      const res = await agent.get('/me').set(authHeaderFor(player.id))

      expect(res.status).toBe(200)
      expect(res.body.roles).toContain('PLAYER')
    })

    it('nominal: combines roles from isAdmin, isReferee and team memberships', async () => {
      const team = await createTeam()
      const user = await createUser({ isAdmin: true, isReferee: true })
      await prisma.userTeam.create({ data: { userId: user.id, teamId: team.id, role: TeamRole.COACH } })

      const res = await agent.get('/me').set(authHeaderFor(user.id, true))

      expect(res.status).toBe(200)
      expect(res.body.roles).toEqual(expect.arrayContaining(['ADMIN', 'REFEREE', 'COACH']))
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/me')

      expect(res.status).toBe(401)
    })
  })

  // ─── login ──────────────────────────────────────────────────────────────
  describe('login — POST /login', () => {
    it('nominal: valid credentials return a token', async () => {
      const user = await createUser()
      const res = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ userId: user.id, email: user.email, isAdmin: false })
      expect(typeof res.body.token).toBe('string')
    })

    it('401 — wrong password', async () => {
      const user = await createUser()
      const res = await agent.post('/login').send({ email: user.email, password: 'WrongPassword1' })

      expect(res.status).toBe(401)
    })

    it('401 — unknown email', async () => {
      const res = await agent.post('/login').send({ email: 'unknown@fixtures.local', password: FIXTURE_PASSWORD })

      expect(res.status).toBe(401)
    })

    it('403 — account not yet activated', async () => {
      const user = await createUser({ isActive: false })
      const res = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })

      expect(res.status).toBe(403)
    })

    it('403 — account blocked', async () => {
      const user = await createUser({ isBlocked: true })
      const res = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })

      expect(res.status).toBe(403)
    })

    it('400 — validation: missing password', async () => {
      const user = await createUser()
      const res = await agent.post('/login').send({ email: user.email })

      expect(res.status).toBe(400)
    })

    it('règle métier: account is blocked after MAX_LOGIN_ATTEMPTS wrong passwords', async () => {
      const user = await createUser()
      const maxAttempts = Number(process.env.MAX_LOGIN_ATTEMPTS)

      let lastRes
      for (let i = 0; i < maxAttempts; i++) {
        lastRes = await agent.post('/login').send({ email: user.email, password: 'WrongPassword1' })
      }

      expect(lastRes?.status).toBe(403)

      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.isBlocked).toBe(true)

      const afterBlock = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })
      expect(afterBlock.status).toBe(403)
    })
  })

  // ─── logout ─────────────────────────────────────────────────────────────
  describe('logout — POST /logout', () => {
    it('nominal: returns 200 for an authenticated user', async () => {
      const user = await createUser()
      const res = await agent.post('/logout').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.post('/logout')

      expect(res.status).toBe(401)
    })
  })
})
