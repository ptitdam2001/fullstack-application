import { randomBytes, randomUUID } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { TeamRole } from '@prisma/client'
import { prisma } from '../../utils/prismaClient'
import { authHeaderFor } from '../support/authenticate'
import { createTestAgent } from '../support/client'
import { resetDatabase } from '../support/database'
import {
  assignUserToTeam,
  createAdmin,
  createAgeCategory,
  createPlayerOfTeam,
  createTeam,
  createUser,
} from '../support/fixtures'

/**
 * MongoDB rejects non-ObjectId strings on `@db.ObjectId` fields with a 500
 * (not a clean 404) — "unknown id" cases need a well-formed but absent id.
 */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

/**
 * `PATCH /team/{id}` validates its body against the `Team` schema (legacy spec —
 * the use case only persists `name`/`color`), so a valid request must still send
 * a full `id` + `areas` shape to pass ajv validation.
 */
const validUpdatePayload = (overrides: Partial<{ name: string; color: string }> = {}) => ({
  id: randomUUID(),
  name: 'Updated',
  areas: [{ _id: randomUUID(), address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.76 }],
  ...overrides,
})

describe('team domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('GET /teams', () => {
    it('lists teams without authentication', async () => {
      const team = await createTeam({ name: 'Alpha' })

      const res = await agent.get('/teams')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([expect.objectContaining({ id: team.id, name: 'Alpha' })])
    })
  })

  describe('GET /teams/count', () => {
    it('counts non-deleted teams', async () => {
      await createTeam()
      await createTeam()

      const res = await agent.get('/teams/count')

      expect(res.status).toBe(200)
      expect(res.body).toBe(2)
    })
  })

  describe('POST /team', () => {
    it('rejects unauthenticated requests', async () => {
      const res = await agent.post('/team').send({ name: 'NoAuth' })

      expect(res.status).toBe(401)
    })

    it('creates a team and auto-assigns the creator as coach', async () => {
      const user = await createUser()

      const res = await agent.post('/team').set(authHeaderFor(user.id)).send({ name: 'Falcons', color: '#ff0000' })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ name: 'Falcons', color: '#ff0000' })
      const userTeam = await prisma.userTeam.findFirst({ where: { userId: user.id, teamId: res.body.id } })
      expect(userTeam?.role).toBe(TeamRole.COACH)
    })

    it('does not auto-assign an admin creator as coach', async () => {
      const admin = await createAdmin()

      const res = await agent.post('/team').set(authHeaderFor(admin.id, true)).send({ name: 'AdminTeam' })

      expect(res.status).toBe(201)
      const userTeam = await prisma.userTeam.findFirst({ where: { userId: admin.id, teamId: res.body.id } })
      expect(userTeam).toBeNull()
    })
  })

  describe('GET /team/:id', () => {
    it('returns a team by id', async () => {
      const team = await createTeam({ name: 'Bravo' })

      const res = await agent.get(`/team/${team.id}`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: team.id, name: 'Bravo' })
    })

    it('returns 404 for an unknown team', async () => {
      const res = await agent.get(`/team/${unknownObjectId()}`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(404)
    })
  })

  describe('PATCH /team/:id', () => {
    it('lets the team coach update the team', async () => {
      const team = await createTeam({ name: 'Original' })
      const coach = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)

      const res = await agent
        .patch(`/team/${team.id}`)
        .set(authHeaderFor(coach.id))
        .send(validUpdatePayload({ name: 'Renamed' }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: team.id, name: 'Renamed' })
      expect((await prisma.team.findUnique({ where: { id: team.id } }))?.name).toBe('Renamed')
    })

    it('lets an admin update any team', async () => {
      const team = await createTeam({ name: 'Original' })
      const admin = await createAdmin()

      const res = await agent
        .patch(`/team/${team.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(validUpdatePayload({ name: 'AdminRenamed' }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ name: 'AdminRenamed' })
    })

    it('rejects callers who are neither admin nor coach of the team', async () => {
      const team = await createTeam()
      const requester = await createUser()

      const res = await agent.patch(`/team/${team.id}`).set(authHeaderFor(requester.id)).send(validUpdatePayload())

      expect(res.status).toBe(403)
    })

    it('returns 404 for an unknown team', async () => {
      const admin = await createAdmin()

      const res = await agent
        .patch(`/team/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send(validUpdatePayload())

      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /team/:id', () => {
    it('rejects non-admin callers', async () => {
      const team = await createTeam()
      const requester = await createUser()

      const res = await agent.delete(`/team/${team.id}`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('soft-deletes the team as admin', async () => {
      const admin = await createAdmin()
      const team = await createTeam()

      const res = await agent.delete(`/team/${team.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      expect((await prisma.team.findUnique({ where: { id: team.id } }))?.deletedAt).not.toBeNull()

      const getRes = await agent.get(`/team/${team.id}`).set(authHeaderFor(admin.id, true))
      expect(getRes.status).toBe(404)
    })

    it('returns 404 for an unknown team', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/team/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })
  })

  describe('GET /team/:teamId/players', () => {
    it('lists players of the team', async () => {
      const team = await createTeam()
      const player = await createPlayerOfTeam(team, 9)

      const res = await agent.get(`/team/${team.id}/players`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([expect.objectContaining({ userId: player.id, teamId: team.id, jersey: 9 })])
    })

    it('returns 404 for an unknown team', async () => {
      const res = await agent.get(`/team/${unknownObjectId()}/players`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(404)
    })
  })

  describe('GET /team/:teamId/calendar', () => {
    it('returns an empty calendar for a team without matches', async () => {
      const team = await createTeam()

      const res = await agent.get(`/team/${team.id}/calendar`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns 404 for an unknown team', async () => {
      const res = await agent.get(`/team/${unknownObjectId()}/calendar`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(404)
    })
  })

  describe('POST /team/:teamId/player/:userId', () => {
    it('rejects callers who are neither admin nor coach of the team', async () => {
      const team = await createTeam()
      const requester = await createUser()
      const target = await createUser()

      const res = await agent.post(`/team/${team.id}/player/${target.id}`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('lets the team coach add a player to the team', async () => {
      const team = await createTeam()
      const coach = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)
      const target = await createUser()

      const res = await agent.post(`/team/${team.id}/player/${target.id}`).set(authHeaderFor(coach.id))

      expect(res.status).toBe(200)
      expect(res.body).toBe(true)
      expect(
        await prisma.player.findUnique({ where: { userId_teamId: { userId: target.id, teamId: team.id } } })
      ).not.toBeNull()
    })
  })

  describe('GET /team/:teamId/coaches', () => {
    it('lists coaches assigned to the team', async () => {
      const team = await createTeam()
      const coach = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)

      const res = await agent.get(`/team/${team.id}/coaches`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([expect.objectContaining({ userId: coach.id, teamId: team.id, role: TeamRole.COACH })])
    })
  })

  describe('POST /team/:teamId/coach/:userId', () => {
    it('rejects non-admin callers', async () => {
      const team = await createTeam()
      const requester = await createUser()
      const target = await createUser()

      const res = await agent.post(`/team/${team.id}/coach/${target.id}`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('assigns a coach as admin', async () => {
      const admin = await createAdmin()
      const team = await createTeam()
      const target = await createUser()

      const res = await agent.post(`/team/${team.id}/coach/${target.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ userId: target.id, teamId: team.id, role: TeamRole.COACH })
    })

    it('returns 409 when the coach is already assigned', async () => {
      const admin = await createAdmin()
      const team = await createTeam()
      const target = await createUser()
      await assignUserToTeam(target.id, team.id, TeamRole.COACH)

      const res = await agent.post(`/team/${team.id}/coach/${target.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(409)
    })
  })

  describe('DELETE /team/:teamId/coach/:userId', () => {
    it('rejects non-admin callers', async () => {
      const team = await createTeam()
      const requester = await createUser()
      const coach = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)

      const res = await agent.delete(`/team/${team.id}/coach/${coach.id}`).set(authHeaderFor(requester.id))

      expect(res.status).toBe(403)
    })

    it('removes an assigned coach as admin', async () => {
      const admin = await createAdmin()
      const team = await createTeam()
      const coach = await createUser()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)

      const res = await agent.delete(`/team/${team.id}/coach/${coach.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      expect(
        await prisma.userTeam.findFirst({ where: { userId: coach.id, teamId: team.id, role: TeamRole.COACH } })
      ).toBeNull()
    })

    it('returns 404 when the assignment does not exist', async () => {
      const admin = await createAdmin()
      const team = await createTeam()
      const target = await createUser()

      const res = await agent.delete(`/team/${team.id}/coach/${target.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })
  })

  describe('GET /user/:userId/coach-teams', () => {
    it('lists teams managed by a coach', async () => {
      const coach = await createUser()
      const team = await createTeam()
      await assignUserToTeam(coach.id, team.id, TeamRole.COACH)

      const res = await agent.get(`/user/${coach.id}/coach-teams`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([expect.objectContaining({ userId: coach.id, teamId: team.id, role: TeamRole.COACH })])
    })
  })

  describe('POST /teams/with-coach', () => {
    it('creates a team and assigns the caller as coach in a single transaction', async () => {
      const user = await createUser()
      const payload = {
        name: 'Transactional FC',
        color: '#123abc',
        areas: [
          {
            _id: randomUUID(),
            name: 'Stade',
            address: '1 rue du Stade',
            city: 'Lyon',
            longitude: 4.83,
            latitude: 45.76,
          },
        ],
      }

      const res = await agent.post('/teams/with-coach').set(authHeaderFor(user.id)).send(payload)

      expect(res.status).toBe(201)
      expect(res.body.team).toMatchObject({ name: payload.name, color: payload.color })
      expect(res.body.userTeam).toMatchObject({ userId: user.id, teamId: res.body.team.id, role: TeamRole.COACH })

      const persistedTeam = await prisma.team.findUnique({ where: { id: res.body.team.id } })
      const persistedUserTeam = await prisma.userTeam.findFirst({
        where: { userId: user.id, teamId: res.body.team.id },
      })
      expect(persistedTeam).not.toBeNull()
      expect(persistedUserTeam?.role).toBe(TeamRole.COACH)
    })
  })

  describe('GET /teams/:teamId/current-group', () => {
    it('returns null when the team is not enrolled in any group', async () => {
      const team = await createTeam()

      const res = await agent.get(`/teams/${team.id}/current-group`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toBeNull()
    })

    it('returns the current group when the team is enrolled', async () => {
      const team = await createTeam()
      const { id: ageCategoryId } = await createAgeCategory()
      const championship = await prisma.championship.create({
        data: {
          name: 'D1',
          ageCategoryId,
          season: '2025-2026',
          pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: -1 },
        },
      })
      const phase = await prisma.phase.create({
        data: { championshipId: championship.id, type: 'GROUP', order: 1, name: 'Phase 1' },
      })
      const group = await prisma.group.create({ data: { phaseId: phase.id, name: 'Poule A', matchMode: 'SINGLE' } })
      await prisma.groupTeam.create({ data: { groupId: group.id, teamId: team.id } })

      const res = await agent.get(`/teams/${team.id}/current-group`).set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual({
        groupId: group.id,
        groupName: 'Poule A',
        phaseId: phase.id,
        championshipId: championship.id,
      })
    })

    it('returns 404 for an unknown team', async () => {
      const res = await agent
        .get(`/teams/${unknownObjectId()}/current-group`)
        .set(authHeaderFor((await createUser()).id))

      expect(res.status).toBe(404)
    })
  })
})
