import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createAgeCategory, createTeam, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('championship domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>
  let defaultAgeCategoryId: string

  const championshipInput = (overrides: Record<string, unknown> = {}) => ({
    name: 'Championnat U13 2026',
    ageCategoryId: defaultAgeCategoryId,
    season: '2025-2026',
    pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
    ...overrides,
  })

  const createChampionship = (overrides: Record<string, unknown> = {}) =>
    prisma.championship.create({ data: championshipInput(overrides) as never })

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
    defaultAgeCategoryId = (await createAgeCategory()).id
  })

  describe('getChampionships — GET /championships', () => {
    it('nominal: lists championships without authentication', async () => {
      const championship = await createChampionship({ name: 'Alpha' })

      const res = await agent.get('/championships')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([expect.objectContaining({ id: championship.id, name: 'Alpha' })])
    })

    it('excludes soft-deleted championships', async () => {
      await prisma.championship.create({
        data: { ...championshipInput({ name: 'Deleted' }), deletedAt: new Date() } as never,
      })

      const res = await agent.get('/championships')

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('paginates results', async () => {
      await createChampionship({ name: 'First' })
      await createChampionship({ name: 'Second' })

      const res = await agent.get('/championships').query({ page: 1, count: 1 })

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
    })
  })

  describe('countChampionships — GET /championships/count', () => {
    it('nominal: counts non-deleted championships', async () => {
      await createChampionship()
      await createChampionship()
      await prisma.championship.create({ data: { ...championshipInput(), deletedAt: new Date() } as never })

      const res = await agent.get('/championships/count')

      expect(res.status).toBe(200)
      expect(res.body).toBe(2)
    })
  })

  describe('createChampionship — POST /championship', () => {
    it('401 — unauthenticated request', async () => {
      const res = await agent.post('/championship').send(championshipInput())

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()

      const res = await agent.post('/championship').set(authHeaderFor(user.id)).send(championshipInput())

      expect(res.status).toBe(403)
    })

    it('nominal: admin creates a championship', async () => {
      const admin = await createAdmin()

      const res = await agent
        .post('/championship')
        .set(authHeaderFor(admin.id, true))
        .send(championshipInput({ name: 'Championnat U13 2026' }))

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        name: 'Championnat U13 2026',
        ageCategoryId: defaultAgeCategoryId,
        season: '2025-2026',
        pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
      })

      const stored = await prisma.championship.findUnique({ where: { id: res.body.id } })
      expect(stored).not.toBeNull()
    })
  })

  describe('getChampionship — GET /championship/{id}', () => {
    it('nominal: returns a championship by id without authentication', async () => {
      const championship = await createChampionship({ name: 'Bravo' })

      const res = await agent.get(`/championship/${championship.id}`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: championship.id, name: 'Bravo' })
    })

    it('404 — unknown id', async () => {
      const res = await agent.get(`/championship/${unknownObjectId()}`)

      expect(res.status).toBe(404)
    })
  })

  describe('updateChampionship — PATCH /championship/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()

      const res = await agent.patch(`/championship/${championship.id}`).send(championshipInput({ name: 'Renamed' }))

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const user = await createUser()

      const res = await agent
        .patch(`/championship/${championship.id}`)
        .set(authHeaderFor(user.id))
        .send(championshipInput({ name: 'Renamed' }))

      expect(res.status).toBe(403)
    })

    it('nominal: admin updates a championship', async () => {
      const championship = await createChampionship({ name: 'Original' })
      const admin = await createAdmin()

      const res = await agent
        .patch(`/championship/${championship.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(championshipInput({ name: 'Renamed' }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: championship.id, name: 'Renamed' })
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent
        .patch(`/championship/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send(championshipInput())

      expect(res.status).toBe(404)
    })
  })

  describe('removeChampionship — DELETE /championship/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const championship = await createChampionship()

      const res = await agent.delete(`/championship/${championship.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const championship = await createChampionship()
      const user = await createUser()

      const res = await agent.delete(`/championship/${championship.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown id', async () => {
      const admin = await createAdmin()

      const res = await agent.delete(`/championship/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
    })

    it('règle métier: hard-deletes a championship without played matches', async () => {
      const championship = await createChampionship()
      const admin = await createAdmin()

      const res = await agent.delete(`/championship/${championship.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.championship.findUnique({ where: { id: championship.id } })
      expect(stored).toBeNull()
    })

    it('règle métier: soft-deletes a championship with played matches', async () => {
      const championship = await createChampionship()
      const phase = await prisma.phase.create({ data: { championshipId: championship.id, type: 'GROUP', order: 1 } })
      const group = await prisma.group.create({ data: { phaseId: phase.id, name: 'Poule A', matchMode: 'SINGLE' } })
      const homeTeam = await createTeam()
      const awayTeam = await createTeam()
      await prisma.match.create({
        data: {
          groupId: group.id,
          status: 'PLAYED',
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          homeGoals: 2,
          awayGoals: 1,
        },
      })
      const admin = await createAdmin()

      const res = await agent.delete(`/championship/${championship.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const stored = await prisma.championship.findUnique({ where: { id: championship.id } })
      expect(stored?.deletedAt).toBeInstanceOf(Date)

      const getRes = await agent.get(`/championship/${championship.id}`)
      expect(getRes.status).toBe(404)
    })
  })
})
