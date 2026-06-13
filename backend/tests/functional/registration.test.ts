import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createTeam, createUser, FIXTURE_PASSWORD } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('registration domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── register ───────────────────────────────────────────────────────────
  describe('register — POST /register', () => {
    it('nominal: creates an inactive user and returns the public profile', async () => {
      const res = await agent.post('/register').send({
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@fixtures.local',
        password: 'Password123',
      })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        firstName: 'Alice',
        lastName: 'Dupont',
        email: 'alice@fixtures.local',
        isActive: false,
        roles: [],
      })
      expect(res.body.password).toBeUndefined()
      expect(res.body.activationTokenExpiry).toBeUndefined()

      const persisted = await prisma.user.findUniqueOrThrow({ where: { email: 'alice@fixtures.local' } })
      expect(persisted.activationToken).not.toBeNull()
    })

    it('nominal: registering with a teamId creates a pending TeamJoinRequest', async () => {
      const team = await createTeam()
      const res = await agent.post('/register').send({
        firstName: 'Bob',
        email: 'bob@fixtures.local',
        password: 'Password123',
        teamId: team.id,
      })

      expect(res.status).toBe(201)
      const user = await prisma.user.findUniqueOrThrow({ where: { email: 'bob@fixtures.local' } })
      const joinRequest = await prisma.teamJoinRequest.findUnique({
        where: { userId_teamId: { userId: user.id, teamId: team.id } },
      })
      expect(joinRequest).toMatchObject({ status: 'PENDING' })
    })

    it('409 — email already in use', async () => {
      const existing = await createUser()
      const res = await agent.post('/register').send({
        firstName: 'Alice',
        email: existing.email,
        password: 'Password123',
      })

      expect(res.status).toBe(409)
      expect(res.body).toMatchObject({ status: 409 })
    })

    it('400 — validation: missing required field', async () => {
      const res = await agent.post('/register').send({ firstName: 'Alice', email: 'alice2@fixtures.local' })

      expect(res.status).toBe(400)
    })

    it('400 — validation: password shorter than 8 characters', async () => {
      const res = await agent.post('/register').send({
        firstName: 'Alice',
        email: 'alice3@fixtures.local',
        password: 'short',
      })

      expect(res.status).toBe(400)
    })
  })

  // ─── activateAccount ────────────────────────────────────────────────────
  describe('activateAccount — POST /activate', () => {
    it('nominal: activates the account with a valid token', async () => {
      await agent.post('/register').send({
        firstName: 'Alice',
        email: 'activate-ok@fixtures.local',
        password: 'Password123',
      })
      const user = await prisma.user.findUniqueOrThrow({ where: { email: 'activate-ok@fixtures.local' } })

      const res = await agent.post('/activate').send({ token: user.activationToken })

      expect(res.status).toBe(200)
      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.isActive).toBe(true)
      expect(persisted.activationToken).toBeNull()
    })

    it('400 — invalid token', async () => {
      const res = await agent.post('/activate').send({ token: 'not-a-real-token' })

      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ status: 400 })
    })
  })

  // ─── resendActivation ───────────────────────────────────────────────────
  describe('resendActivation — POST /resend-activation', () => {
    it('nominal: generates a new activation token for an inactive user', async () => {
      await agent.post('/register').send({
        firstName: 'Alice',
        email: 'resend@fixtures.local',
        password: 'Password123',
      })
      const before = await prisma.user.findUniqueOrThrow({ where: { email: 'resend@fixtures.local' } })

      const res = await agent.post('/resend-activation').send({ email: 'resend@fixtures.local' })

      expect(res.status).toBe(200)
      const after = await prisma.user.findUniqueOrThrow({ where: { email: 'resend@fixtures.local' } })
      expect(after.activationToken).not.toBe(before.activationToken)
    })

    it('règle métier: returns 200 for an unknown email (anti-enumeration)', async () => {
      const res = await agent.post('/resend-activation').send({ email: 'unknown@fixtures.local' })

      expect(res.status).toBe(200)
    })
  })

  // ─── forgotPassword ─────────────────────────────────────────────────────
  describe('forgotPassword — POST /forgot-password', () => {
    it('nominal: sets a reset token for an existing user', async () => {
      const user = await createUser()
      const res = await agent.post('/forgot-password').send({ email: user.email })

      expect(res.status).toBe(200)
      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.resetToken).not.toBeNull()
      expect(persisted.resetTokenExpiry).not.toBeNull()
    })

    it('règle métier: returns 200 for an unknown email (anti-enumeration)', async () => {
      const res = await agent.post('/forgot-password').send({ email: 'unknown@fixtures.local' })

      expect(res.status).toBe(200)
    })
  })

  // ─── resetPassword ──────────────────────────────────────────────────────
  describe('resetPassword — POST /reset-password', () => {
    it('nominal: resets the password and allows login with the new password', async () => {
      const user = await createUser()
      await agent.post('/forgot-password').send({ email: user.email })
      const { resetToken } = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

      const res = await agent.post('/reset-password').send({ token: resetToken, newPassword: 'NewPassword123' })

      expect(res.status).toBe(200)

      const oldLogin = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })
      expect(oldLogin.status).toBe(401)

      const newLogin = await agent.post('/login').send({ email: user.email, password: 'NewPassword123' })
      expect(newLogin.status).toBe(200)
    })

    it('400 — invalid token', async () => {
      const res = await agent.post('/reset-password').send({ token: 'not-a-real-token', newPassword: 'NewPassword123' })

      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ status: 400 })
    })
  })

  // ─── declareReferee ─────────────────────────────────────────────────────
  describe('declareReferee — POST /me/referee', () => {
    it('nominal: marks the authenticated user as referee', async () => {
      const user = await createUser()
      const res = await agent.post('/me/referee').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.isReferee).toBe(true)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.post('/me/referee')

      expect(res.status).toBe(401)
    })
  })

  // ─── adminActivateUser ──────────────────────────────────────────────────
  describe('adminActivateUser — PATCH /users/{userId}/activate', () => {
    it('nominal: admin activates a pending user', async () => {
      const admin = await createAdmin()
      const user = await createUser({ isActive: false })

      const res = await agent.patch(`/users/${user.id}/activate`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.isActive).toBe(true)
    })

    it('401 — unauthenticated request', async () => {
      const user = await createUser({ isActive: false })
      const res = await agent.patch(`/users/${user.id}/activate`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const requester = await createUser()
      const user = await createUser({ isActive: false })
      const res = await agent.patch(`/users/${user.id}/activate`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown userId', async () => {
      const admin = await createAdmin()
      const res = await agent.patch(`/users/${unknownObjectId()}/activate`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })
  })

  // ─── adminUnblockUser ───────────────────────────────────────────────────
  describe('adminUnblockUser — PATCH /users/{userId}/unblock', () => {
    it('nominal: admin unblocks a blocked user', async () => {
      const admin = await createAdmin()
      const user = await createUser({ isBlocked: true })

      const res = await agent.patch(`/users/${user.id}/unblock`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      const persisted = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(persisted.isBlocked).toBe(false)
    })

    it('401 — unauthenticated request', async () => {
      const user = await createUser({ isBlocked: true })
      const res = await agent.patch(`/users/${user.id}/unblock`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const requester = await createUser()
      const user = await createUser({ isBlocked: true })
      const res = await agent.patch(`/users/${user.id}/unblock`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown userId', async () => {
      const admin = await createAdmin()
      const res = await agent.patch(`/users/${unknownObjectId()}/unblock`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })
  })
})
