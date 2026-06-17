import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createTeam, createUser } from '../support/fixtures.js'
import { TeamRole } from '@prisma/client'

const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('teamJoinRequest domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('POST /teams/{teamId}/join-requests', () => {
    it('creates a join request as PLAYER', async () => {
      const user = await createUser()
      const team = await createTeam()

      const res = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        userId: user.id,
        teamId: team.id,
        requestedRole: TeamRole.PLAYER,
        status: 'PENDING',
      })
      expect(res.body.id).toBeDefined()
    })

    it('creates a join request as COACH', async () => {
      const user = await createUser()
      const team = await createTeam()

      const res = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.COACH })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ requestedRole: TeamRole.COACH, status: 'PENDING' })
    })

    it('upserts to PENDING when previous request was REFUSED', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      // Create then refuse
      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'refuse' })

      // Re-create
      const res = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.COACH })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ status: 'PENDING', requestedRole: TeamRole.COACH })
    })

    it('returns 409 when user is already an approved member', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      // Create and approve
      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      // Try again
      const res = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      expect(res.status).toBe(409)
    })

    it('returns 401 without authentication', async () => {
      const team = await createTeam()

      const res = await agent.post(`/teams/${team.id}/join-requests`).send({ requestedRole: TeamRole.PLAYER })

      expect(res.status).toBe(401)
    })
  })

  describe('GET /teams/{teamId}/join-requests', () => {
    it('lists all join requests for a team', async () => {
      const team = await createTeam()
      const user1 = await createUser()
      const user2 = await createUser()
      const admin = await createAdmin()

      await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user1.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user2.id))
        .send({ requestedRole: TeamRole.COACH })

      const res = await agent.get(`/teams/${team.id}/join-requests`).set(authHeaderFor(admin.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })

    it('filters by status=PENDING', async () => {
      const team = await createTeam()
      const user1 = await createUser()
      const user2 = await createUser()
      const admin = await createAdmin()

      const req1 = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user1.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user2.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .patch(`/teams/${team.id}/join-requests/${req1.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'refuse' })

      const res = await agent
        .get(`/teams/${team.id}/join-requests`)
        .query({ status: 'PENDING' })
        .set(authHeaderFor(admin.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].userId).toBe(user2.id)
    })

    it('returns empty array for team with no requests', async () => {
      const team = await createTeam()
      const admin = await createAdmin()

      const res = await agent.get(`/teams/${team.id}/join-requests`).set(authHeaderFor(admin.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns 401 without authentication', async () => {
      const team = await createTeam()

      const res = await agent.get(`/teams/${team.id}/join-requests`)

      expect(res.status).toBe(401)
    })
  })

  describe('PATCH /teams/{teamId}/join-requests/{requestId}', () => {
    it('approves a join request → status APPROVED + UserTeam created', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.COACH })

      const res = await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ status: 'APPROVED', userId: user.id, teamId: team.id })

      const userTeam = await prisma.userTeam.findFirst({ where: { userId: user.id, teamId: team.id } })
      expect(userTeam).not.toBeNull()
      expect(userTeam?.role).toBe(TeamRole.COACH)
    })

    it('approves PLAYER request → also creates Player record', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      const player = await prisma.player.findUnique({ where: { userId_teamId: { userId: user.id, teamId: team.id } } })
      expect(player).not.toBeNull()
    })

    it('refuses a join request → status REFUSED, no UserTeam created', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      const res = await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'refuse' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ status: 'REFUSED' })

      const userTeam = await prisma.userTeam.findFirst({ where: { userId: user.id, teamId: team.id } })
      expect(userTeam).toBeNull()
    })

    it('returns 404 for unknown requestId', async () => {
      const team = await createTeam()
      const admin = await createAdmin()

      const res = await agent
        .patch(`/teams/${team.id}/join-requests/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      expect(res.status).toBe(404)
    })

    it('returns 404 when requestId belongs to a different team', async () => {
      const user = await createUser()
      const team1 = await createTeam()
      const team2 = await createTeam()
      const admin = await createAdmin()

      const createRes = await agent
        .post(`/teams/${team1.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      const res = await agent
        .patch(`/teams/${team2.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      expect(res.status).toBe(404)
    })

    it('returns 404 when request is already APPROVED', async () => {
      const user = await createUser()
      const team = await createTeam()
      const admin = await createAdmin()

      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })
      await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'approve' })

      const res = await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .set(authHeaderFor(admin.id))
        .send({ action: 'refuse' })

      expect(res.status).toBe(404)
    })

    it('returns 401 without authentication', async () => {
      const user = await createUser()
      const team = await createTeam()

      const createRes = await agent
        .post(`/teams/${team.id}/join-requests`)
        .set(authHeaderFor(user.id))
        .send({ requestedRole: TeamRole.PLAYER })

      const res = await agent
        .patch(`/teams/${team.id}/join-requests/${createRes.body.id}`)
        .send({ action: 'approve' })

      expect(res.status).toBe(401)
    })
  })
})