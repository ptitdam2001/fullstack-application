import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createChampionship, createPhase, createTeam, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('phase domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('getChampionshipPhases — GET /championship/{championshipId}/phases', () => {
    it('nominal: lists phases of a championship ordered by order, without authentication', async () => {
      const championship = await createChampionship()
      const phase2 = await createPhase(championship.id, { type: 'KNOCKOUT', order: 2, name: 'Phase finale' })
      const phase1 = await createPhase(championship.id, { type: 'GROUP', order: 1, name: 'Phase de poules' })

      const res = await agent.get(`/championship/${championship.id}/phases`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([
        expect.objectContaining({ id: phase1.id, order: 1 }),
        expect.objectContaining({ id: phase2.id, order: 2 }),
      ])
    })

    it('excludes soft-deleted phases', async () => {
      const championship = await createChampionship()
      await prisma.phase.create({ data: { championshipId: championship.id, type: 'GROUP', order: 1, deletedAt: new Date() } })

      const res = await agent.get(`/championship/${championship.id}/phases`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns an empty array for a championship without phases', async () => {
      const championship = await createChampionship()

      const res = await agent.get(`/championship/${championship.id}/phases`)

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  describe('createPhase — POST /phase', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()

      const res = await agent.post('/phase').send({ championshipId: championship.id, type: 'GROUP', order: 1 })

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const user = await createUser()

      const res = await agent
        .post('/phase')
        .set(authHeaderFor(user.id))
        .send({ championshipId: championship.id, type: 'GROUP', order: 1 })

      expect(res.status).toBe(403)
    })

    it('nominal: admin creates a phase', async () => {
      const championship = await createChampionship()
      const admin = await createAdmin()

      const res = await agent
        .post('/phase')
        .set(authHeaderFor(admin.id, true))
        .send({ championshipId: championship.id, type: 'GROUP', order: 1, name: 'Phase de poules' })

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({ championshipId: championship.id, type: 'GROUP', order: 1, name: 'Phase de poules' })

      const stored = await prisma.phase.findUnique({ where: { id: res.body.id } })
      expect(stored).not.toBeNull()
    })

    it('règle métier: 409 when a phase with the same order already exists in the championship', async () => {
      const championship = await createChampionship()
      await createPhase(championship.id, { order: 1 })
      const admin = await createAdmin()

      const res = await agent
        .post('/phase')
        .set(authHeaderFor(admin.id, true))
        .send({ championshipId: championship.id, type: 'KNOCKOUT', order: 1 })

      expect(res.status).toBe(409)
    })

    it('règle métier: allows the same order in different championships', async () => {
      const championship1 = await createChampionship()
      const championship2 = await createChampionship()
      await createPhase(championship1.id, { order: 1 })
      const admin = await createAdmin()

      const res = await agent
        .post('/phase')
        .set(authHeaderFor(admin.id, true))
        .send({ championshipId: championship2.id, type: 'GROUP', order: 1 })

      expect(res.status).toBe(201)
    })
  })

  describe('getPhase — GET /phase/{id}', () => {
    it('nominal: returns a phase by id without authentication', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id, { name: 'Phase de poules' })

      const res = await agent.get(`/phase/${phase.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: phase.id, name: 'Phase de poules' })
    })

    it('404 — unknown id', async () => {
      const res = await agent.get(`/phase/${unknownObjectId()}`)

      expect(res.status).toBe(404)
    })
  })

  describe('updatePhase — PATCH /phase/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)

      const res = await agent
        .patch(`/phase/${phase.id}`)
        .send({ championshipId: championship.id, type: 'GROUP', order: 1, name: 'Renamed' })

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const user = await createUser()

      const res = await agent
        .patch(`/phase/${phase.id}`)
        .set(authHeaderFor(user.id))
        .send({ championshipId: championship.id, type: 'GROUP', order: 1, name: 'Renamed' })

      expect(res.status).toBe(403)
    })

    it('nominal: admin updates a phase', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id, { name: 'Original' })
      const admin = await createAdmin()

      const res = await agent
        .patch(`/phase/${phase.id}`)
        .set(authHeaderFor(admin.id, true))
        .send({ championshipId: championship.id, type: 'GROUP', order: 1, name: 'Renamed' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: phase.id, name: 'Renamed' })
    })

    it('404 — unknown id', async () => {
      const championship = await createChampionship()
      const admin = await createAdmin()

      const res = await agent
        .patch(`/phase/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send({ championshipId: championship.id, type: 'GROUP', order: 1 })

      expect(res.status).toBe(404)
    })
  })

  describe('removePhase — DELETE /phase/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)

      const res = await agent.delete(`/phase/${phase.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const user = await createUser()

      const res = await agent.delete(`/phase/${phase.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/phase/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })

    it('règle métier: hard-deletes a phase without played matches', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const admin = await createAdmin()

      const res = await agent.delete(`/phase/${phase.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.phase.findUnique({ where: { id: phase.id } })
      expect(stored).toBeNull()
    })

    it('règle métier: soft-deletes a phase with played matches', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const group = await prisma.group.create({ data: { phaseId: phase.id, name: 'Poule A', matchMode: 'SINGLE' } })
      const homeTeam = await createTeam()
      const awayTeam = await createTeam()
      await prisma.match.create({
        data: {
          groupId: group.id,
          status: 'PLAYED',
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeGoals: 1,
          awayGoals: 0,
        },
      })
      const admin = await createAdmin()

      const res = await agent.delete(`/phase/${phase.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.phase.findUnique({ where: { id: phase.id } })
      expect(stored?.deletedAt).toBeInstanceOf(Date)

      const getRes = await agent.get(`/phase/${phase.id}`)
      expect(getRes.status).toBe(404)
    })
  })
})