import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createChampionship, createGroup, createPhase, createTeam, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('group domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('getPhaseGroups — GET /phase/{phaseId}/groups', () => {
    it('nominal: lists groups of a phase without authentication', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const group = await createGroup(phase.id, { name: 'Poule A', teamIds: [teamA.id, teamB.id] })

      const res = await agent.get(`/phase/${phase.id}/groups`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([
        expect.objectContaining({ id: group.id, name: 'Poule A', matchMode: 'SINGLE', teamIds: expect.arrayContaining([teamA.id, teamB.id]) }),
      ])
    })

    it('excludes soft-deleted groups', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      await prisma.group.create({ data: { phaseId: phase.id, name: 'Deleted', matchMode: 'SINGLE', deletedAt: new Date() } })

      const res = await agent.get(`/phase/${phase.id}/groups`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns an empty array for a phase without groups', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)

      const res = await agent.get(`/phase/${phase.id}/groups`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('createGroup — POST /group', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)

      const res = await agent.post('/group').send({ phaseId: phase.id, name: 'Poule A', matchMode: 'SINGLE', teamIds: [] })

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const user = await createUser()

      const res = await agent
        .post('/group')
        .set(authHeaderFor(user.id))
        .send({ phaseId: phase.id, name: 'Poule A', matchMode: 'SINGLE', teamIds: [] })

      expect(res.status).toBe(403)
    })

    it('nominal: admin creates a group with teams', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const admin = await createAdmin()

      const res = await agent
        .post('/group')
        .set(authHeaderFor(admin.id, true))
        .send({ phaseId: phase.id, name: 'Poule A', matchMode: 'HOME_AND_AWAY', teamIds: [teamA.id, teamB.id] })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        phaseId: phase.id,
        name: 'Poule A',
        matchMode: 'HOME_AND_AWAY',
        teamIds: expect.arrayContaining([teamA.id, teamB.id]),
      })

      const stored = await prisma.group.findUnique({ where: { id: res.body.id }, include: { groupTeams: true } })
      expect(stored?.groupTeams).toHaveLength(2)
    })
  })

  describe('getGroup — GET /group/{id}', () => {
    it('nominal: returns a group by id without authentication', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id, { name: 'Poule A' })

      const res = await agent.get(`/group/${group.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: group.id, name: 'Poule A' })
    })

    it('404 — unknown id', async () => {
      const res = await agent.get(`/group/${unknownObjectId()}`)

      expect(res.status).toBe(404)
    })
  })

  describe('updateGroup — PATCH /group/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)

      const res = await agent
        .patch(`/group/${group.id}`)
        .send({ phaseId: phase.id, name: 'Renamed', matchMode: 'SINGLE', teamIds: [] })

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)
      const user = await createUser()

      const res = await agent
        .patch(`/group/${group.id}`)
        .set(authHeaderFor(user.id))
        .send({ phaseId: phase.id, name: 'Renamed', matchMode: 'SINGLE', teamIds: [] })

      expect(res.status).toBe(403)
    })

    it('nominal: admin updates a group, replacing its teams', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const group = await createGroup(phase.id, { name: 'Original', teamIds: [teamA.id] })
      const admin = await createAdmin()

      const res = await agent
        .patch(`/group/${group.id}`)
        .set(authHeaderFor(admin.id, true))
        .send({ phaseId: phase.id, name: 'Renamed', matchMode: 'SINGLE', teamIds: [teamB.id] })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: group.id, name: 'Renamed', teamIds: [teamB.id] })
    })

    it('404 — unknown id', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const admin = await createAdmin()

      const res = await agent
        .patch(`/group/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send({ phaseId: phase.id, name: 'Renamed', matchMode: 'SINGLE', teamIds: [] })

      expect(res.status).toBe(404)
    })
  })

  describe('removeGroup — DELETE /group/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)

      const res = await agent.delete(`/group/${group.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)
      const user = await createUser()

      const res = await agent.delete(`/group/${group.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/group/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })

    it('règle métier: hard-deletes a group without played matches', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)
      const admin = await createAdmin()

      const res = await agent.delete(`/group/${group.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.group.findUnique({ where: { id: group.id } })
      expect(stored).toBeNull()
    })

    it('règle métier: soft-deletes a group with played matches', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await createGroup(phase.id)
      const homeTeam = await createTeam()
      const awayTeam = await createTeam()
      await prisma.match.create({
        data: {
          groupId: group.id,
          status: 'PLAYED',
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeGoals: 3,
          awayGoals: 2,
        },
      })
      const admin = await createAdmin()

      const res = await agent.delete(`/group/${group.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.group.findUnique({ where: { id: group.id } })
      expect(stored?.deletedAt).toBeInstanceOf(Date)

      const getRes = await agent.get(`/group/${group.id}`)
      expect(getRes.status).toBe(404)
    })
  })
})