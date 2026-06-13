import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createTeam, createUser } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

const makeArea = () => ({
  id: randomBytes(12).toString('hex'),
  name: 'Stade Municipal',
  address: '1 rue du Stade',
  city: 'Lyon',
  longitude: 4.83,
  latitude: 45.76,
})

/**
 * Minimal valid MatchInput for POST /match and PATCH /match/{id}.
 * homeTeamId/awayTeamId are MongoDB ObjectId strings — the openapi.yml declares
 * format: uuid on these fields; if AJV format validation is strict, tests sending
 * ObjectId-format IDs will fail with 400. Run once to verify.
 */
const matchBody = (homeTeamId: string, awayTeamId: string, overrides: Record<string, unknown> = {}) => ({
  homeTeamId,
  awayTeamId,
  area: makeArea(),
  ...overrides,
})

const seedMatchSelect = {
  id: true,
  groupId: true,
  status: true,
  scheduledAt: true,
  homeTeamId: true,
  awayTeamId: true,
  homeGoals: true,
  awayGoals: true,
  forfeitedBy: true,
  updatedAt: true,
} as const

const seedMatch = (homeTeamId: string, awayTeamId: string, overrides: Record<string, unknown> = {}) =>
  prisma.match.create({
    data: { homeTeamId, awayTeamId, area: makeArea(), status: 'SCHEDULED', ...overrides },
    select: seedMatchSelect,
  })

describe('match domain — functional API (CRUD)', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── countMatches ─────────────────────────────────────────────────────────
  describe('countMatches — GET /matches/count', () => {
    it('nominal: returns 0 when DB is empty', async () => {
      const user = await createUser()
      const res = await agent.get('/matches/count').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toBe(0)
    })

    it('nominal: counts non-deleted matches only', async () => {
      const home = await createTeam()
      const away = await createTeam()
      await seedMatch(home.id, away.id)
      await seedMatch(home.id, away.id)
      const deleted = await seedMatch(home.id, away.id)
      await prisma.match.update({ where: { id: deleted.id }, data: { deletedAt: new Date() } })

      const user = await createUser()
      const res = await agent.get('/matches/count').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toBe(2)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/matches/count')
      expect(res.status).toBe(401)
    })
  })

  // ─── getMatches ───────────────────────────────────────────────────────────
  describe('getMatches — GET /matches', () => {
    it('nominal: returns empty array when no matches', async () => {
      const user = await createUser()
      const res = await agent.get('/matches').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('nominal: returns array of non-deleted matches', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const softDeleted = await seedMatch(home.id, away.id)
      await prisma.match.update({ where: { id: softDeleted.id }, data: { deletedAt: new Date() } })

      const user = await createUser()
      const res = await agent.get('/matches').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({ id: match.id, homeTeamId: home.id, awayTeamId: away.id })
    })

    it('nominal: paginates via page + count query params', async () => {
      const home = await createTeam()
      const away = await createTeam()
      for (let i = 0; i < 5; i++) {
        await seedMatch(home.id, away.id)
      }

      const user = await createUser()
      const res = await agent.get('/matches?page=1&count=3').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(3)
    })

    it('règle métier: status filter returns only matching matches', async () => {
      const home = await createTeam()
      const away = await createTeam()
      await seedMatch(home.id, away.id, { status: 'SCHEDULED' })
      await seedMatch(home.id, away.id, { status: 'PLAYED', homeGoals: 2, awayGoals: 1 })

      const user = await createUser()
      const res = await agent.get('/matches?status=PLAYED').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      // NOTE: this will fail if the handler ignores the status filter (known bug: getMatches
      // handler reads only page/count, does not forward status/pastDue to the use case)
      expect(res.body.every((m: { status: string }) => m.status === 'PLAYED')).toBe(true)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/matches')
      expect(res.status).toBe(401)
    })
  })

  // ─── getMatch ─────────────────────────────────────────────────────────────
  describe('getMatch — GET /match/{id}', () => {
    it('nominal: returns match by id', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        id: match.id,
        homeTeamId: home.id,
        awayTeamId: away.id,
        status: 'SCHEDULED',
      })
    })

    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const res = await agent.get(`/match/${match.id}`)
      expect(res.status).toBe(401)
    })

    it('404 — unknown match id', async () => {
      const user = await createUser()
      const res = await agent.get(`/match/${unknownObjectId()}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })

    it('règle métier: soft-deleted match returns 404', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      await prisma.match.update({ where: { id: match.id }, data: { deletedAt: new Date() } })

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(404)
    })
  })

  // ─── addMatch ─────────────────────────────────────────────────────────────
  describe('addMatch — POST /match', () => {
    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const res = await agent.post('/match').send(matchBody(home.id, away.id))

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const home = await createTeam()
      const away = await createTeam()
      const res = await agent.post('/match').set(authHeaderFor(user.id)).send(matchBody(home.id, away.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin creates match with SCHEDULED status by default', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const res = await agent.post('/match').set(authHeaderFor(admin.id, true)).send(matchBody(home.id, away.id))

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        id: expect.any(String),
        homeTeamId: home.id,
        awayTeamId: away.id,
        status: 'SCHEDULED',
        homeGoals: null,
        awayGoals: null,
        forfeitedBy: null,
      })

      const persisted = await prisma.match.findFirst({ where: { id: res.body.id } })
      expect(persisted).not.toBeNull()
      expect(persisted?.status).toBe('SCHEDULED')
    })

    it('nominal: admin creates match with explicit scheduledAt', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const scheduledAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()

      const res = await agent
        .post('/match')
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { scheduledAt }))

      expect(res.status).toBe(201)
      expect(res.body.scheduledAt).not.toBeNull()
    })

    it('400 — missing required homeTeamId fails ajv validation', async () => {
      const admin = await createAdmin()
      const away = await createTeam()
      const res = await agent
        .post('/match')
        .set(authHeaderFor(admin.id, true))
        .send({ awayTeamId: away.id, area: makeArea() })

      expect(res.status).toBe(400)
    })

    it('400 — missing required area fails ajv validation', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const res = await agent
        .post('/match')
        .set(authHeaderFor(admin.id, true))
        .send({ homeTeamId: home.id, awayTeamId: away.id })

      expect(res.status).toBe(400)
    })
  })

  // ─── editMatch ────────────────────────────────────────────────────────────
  describe('editMatch — PATCH /match/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const res = await agent.patch(`/match/${match.id}`).send(matchBody(home.id, away.id))

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const res = await agent.patch(`/match/${match.id}`).set(authHeaderFor(user.id)).send(matchBody(home.id, away.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown match id', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const res = await agent
        .patch(`/match/${unknownObjectId()}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })

    it('nominal: admin records score → PLAYED', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const res = await agent
        .patch(`/match/${match.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { status: 'PLAYED', homeGoals: 2, awayGoals: 1 }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: match.id, status: 'PLAYED', homeGoals: 2, awayGoals: 1 })

      const persisted = await prisma.match.findFirst({ where: { id: match.id } })
      expect(persisted?.status).toBe('PLAYED')
      expect(persisted?.homeGoals).toBe(2)
      expect(persisted?.awayGoals).toBe(1)
    })

    it('nominal: admin corrects score of already-PLAYED match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { status: 'PLAYED', homeGoals: 1, awayGoals: 0 })

      const res = await agent
        .patch(`/match/${match.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { status: 'PLAYED', homeGoals: 3, awayGoals: 2 }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ homeGoals: 3, awayGoals: 2 })
    })

    it('règle métier: admin declares forfeit (FORFEITED + forfeitedBy persisted)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const res = await agent
        .patch(`/match/${match.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { status: 'FORFEITED', forfeitedBy: home.id }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ status: 'FORFEITED', forfeitedBy: home.id })

      const persisted = await prisma.match.findFirst({ where: { id: match.id } })
      expect(persisted?.status).toBe('FORFEITED')
      expect(persisted?.forfeitedBy).toBe(home.id)
    })

    it('règle métier: admin cancels a SCHEDULED match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const res = await agent
        .patch(`/match/${match.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { status: 'CANCELLED' }))

      expect(res.status).toBe(200)
      expect(res.body.status).toBe('CANCELLED')
    })
  })

  // ─── removeMatch ──────────────────────────────────────────────────────────
  describe('removeMatch — DELETE /match/{id}', () => {
    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const res = await agent.delete(`/match/${match.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const res = await agent.delete(`/match/${match.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown match id', async () => {
      const admin = await createAdmin()
      const res = await agent.delete(`/match/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })

    it('règle métier: SCHEDULED match is hard-deleted (record gone from DB)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { status: 'SCHEDULED' })

      const res = await agent.delete(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      // Hard-delete: findUnique bypasses soft-delete filter — record must not exist at all
      const persisted = await prisma.match.findUnique({ where: { id: match.id } })
      expect(persisted).toBeNull()
    })

    it('règle métier: CANCELLED match is hard-deleted (record gone from DB)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { status: 'CANCELLED' })

      const res = await agent.delete(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const persisted = await prisma.match.findUnique({ where: { id: match.id } })
      expect(persisted).toBeNull()
    })

    it('règle métier: PLAYED match is soft-deleted (deletedAt set, record preserved)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { status: 'PLAYED', homeGoals: 2, awayGoals: 1 })

      const res = await agent.delete(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      // Soft-delete: record still in DB with deletedAt set
      const persisted = await prisma.match.findUnique({ where: { id: match.id } })
      expect(persisted).not.toBeNull()
      expect(persisted?.deletedAt).not.toBeNull()
      // And must no longer appear in GET /matches
      const user = await createUser()
      const listRes = await agent.get('/matches').set(authHeaderFor(user.id))
      expect(listRes.body.find((m: { id: string }) => m.id === match.id)).toBeUndefined()
    })

    it('règle métier: FORFEITED match is soft-deleted (deletedAt set, record preserved)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { status: 'FORFEITED', forfeitedBy: home.id })

      const res = await agent.delete(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const persisted = await prisma.match.findUnique({ where: { id: match.id } })
      expect(persisted).not.toBeNull()
      expect(persisted?.deletedAt).not.toBeNull()
    })
  })
})
