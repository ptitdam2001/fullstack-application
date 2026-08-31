import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import {
  createAdmin,
  createAgeCategory,
  createGroup,
  createPhase,
  createTeam,
  createUser,
} from '../support/fixtures.js'

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

/**
 * The shared `createChampionship` fixture (tests/support/fixtures.ts) predates the
 * Season model migration — it still writes a `season` string field that no longer
 * exists on the schema (seasonId is required instead), so it fails on every call.
 * Pre-existing, unrelated to this test file (see commit 65a572f). Bypassed here with
 * a local, schema-correct helper rather than fixed — fixing the shared fixture affects
 * 4 other test files outside this change's scope.
 */
const seedChampionship = async (ageCategoryId: string) => {
  const suffix = randomBytes(4).toString('hex')
  const season = await prisma.season.create({ data: { label: `Saison-${suffix}` } })
  return prisma.championship.create({
    data: {
      name: `Championnat-${suffix}`,
      ageCategoryId,
      seasonId: season.id,
      pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
    },
  })
}

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
      const admin = await createAdmin()
      const res = await agent.get('/matches/count').set(authHeaderFor(admin.id, true))

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

      const admin = await createAdmin()
      const res = await agent.get('/matches/count').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toBe(2)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/matches/count')
      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const res = await agent.get('/matches/count').set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })
  })

  // ─── getMatches ───────────────────────────────────────────────────────────
  describe('getMatches — GET /matches', () => {
    it('nominal: returns empty array when no matches', async () => {
      const admin = await createAdmin()
      const res = await agent.get('/matches').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('nominal: returns array of non-deleted matches', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const softDeleted = await seedMatch(home.id, away.id)
      await prisma.match.update({ where: { id: softDeleted.id }, data: { deletedAt: new Date() } })

      const admin = await createAdmin()
      const res = await agent.get('/matches').set(authHeaderFor(admin.id, true))

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

      const admin = await createAdmin()
      const res = await agent.get('/matches?page=1&count=3').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(3)
    })

    it('règle métier: status filter returns only matching matches', async () => {
      const home = await createTeam()
      const away = await createTeam()
      await seedMatch(home.id, away.id, { status: 'SCHEDULED' })
      await seedMatch(home.id, away.id, { status: 'PLAYED', homeGoals: 2, awayGoals: 1 })

      const admin = await createAdmin()
      const res = await agent.get('/matches?status=PLAYED').set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      // NOTE: this will fail if the handler ignores the status filter (known bug: getMatches
      // handler reads only page/count, does not forward status/pastDue to the use case)
      expect(res.body.every((m: { status: string }) => m.status === 'PLAYED')).toBe(true)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.get('/matches')
      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const res = await agent.get('/matches').set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })
  })

  // ─── getMatches / countMatches — championshipId / ageCategoryId filters ───
  describe('getMatches, countMatches — filter by championshipId / ageCategoryId', () => {
    it('règle métier: championshipId filters matches via group→phase (2-hop relation filter)', async () => {
      const catA = await createAgeCategory({ label: 'U13' })
      const catB = await createAgeCategory({ label: 'U15' })
      const champA = await seedChampionship(catA.id)
      const champB = await seedChampionship(catB.id)
      const phaseA = await createPhase(champA.id)
      const phaseB = await createPhase(champB.id)
      const [homeA, awayA] = [await createTeam(), await createTeam()]
      const [homeB, awayB] = [await createTeam(), await createTeam()]
      const groupA = await createGroup(phaseA.id, { teamIds: [homeA.id, awayA.id] })
      const groupB = await createGroup(phaseB.id, { teamIds: [homeB.id, awayB.id] })
      const matchA = await seedMatch(homeA.id, awayA.id, { groupId: groupA.id })
      await seedMatch(homeB.id, awayB.id, { groupId: groupB.id })

      const admin = await createAdmin()
      const listRes = await agent.get(`/matches?championshipId=${champA.id}`).set(authHeaderFor(admin.id, true))
      const countRes = await agent.get(`/matches/count?championshipId=${champA.id}`).set(authHeaderFor(admin.id, true))

      expect(listRes.status).toBe(200)
      expect(listRes.body).toHaveLength(1)
      expect(listRes.body[0].id).toBe(matchA.id)
      expect(countRes.body).toBe(1)
    })

    it('règle métier: ageCategoryId filters matches via group→phase→championship (3-hop relation filter)', async () => {
      const catA = await createAgeCategory({ label: 'U13' })
      const catB = await createAgeCategory({ label: 'U15' })
      const champA = await seedChampionship(catA.id)
      const champB = await seedChampionship(catB.id)
      const phaseA = await createPhase(champA.id)
      const phaseB = await createPhase(champB.id)
      const [homeA, awayA] = [await createTeam(), await createTeam()]
      const [homeB, awayB] = [await createTeam(), await createTeam()]
      const groupA = await createGroup(phaseA.id, { teamIds: [homeA.id, awayA.id] })
      const groupB = await createGroup(phaseB.id, { teamIds: [homeB.id, awayB.id] })
      const matchA = await seedMatch(homeA.id, awayA.id, { groupId: groupA.id })
      await seedMatch(homeB.id, awayB.id, { groupId: groupB.id })

      const admin = await createAdmin()
      const listRes = await agent.get(`/matches?ageCategoryId=${catA.id}`).set(authHeaderFor(admin.id, true))
      const countRes = await agent.get(`/matches/count?ageCategoryId=${catA.id}`).set(authHeaderFor(admin.id, true))

      expect(listRes.status).toBe(200)
      expect(listRes.body).toHaveLength(1)
      expect(listRes.body[0].id).toBe(matchA.id)
      expect(countRes.body).toBe(1)
    })

    it('règle métier: championshipId also matches bracket-based (knockout) matches', async () => {
      const cat = await createAgeCategory({ label: 'U11' })
      const champ = await seedChampionship(cat.id)
      const otherChamp = await seedChampionship((await createAgeCategory({ label: 'U9' })).id)
      const phase = await createPhase(champ.id, { type: 'KNOCKOUT' })
      const otherPhase = await createPhase(otherChamp.id, { type: 'KNOCKOUT' })
      const bracket = await prisma.bracket.create({ data: { phaseId: phase.id, name: 'Éliminatoires' } })
      const otherBracket = await prisma.bracket.create({ data: { phaseId: otherPhase.id, name: 'Éliminatoires' } })
      const [home, away] = [await createTeam(), await createTeam()]
      const match = await seedMatch(home.id, away.id, { bracketId: bracket.id, groupId: undefined })
      await seedMatch(home.id, away.id, { bracketId: otherBracket.id, groupId: undefined })

      const admin = await createAdmin()
      const res = await agent.get(`/matches?championshipId=${champ.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].id).toBe(match.id)
    })

    it('règle métier: championship with no phases yet returns an empty result, not everything', async () => {
      const cat = await createAgeCategory({ label: 'U17' })
      const emptyChamp = await seedChampionship(cat.id)
      const home = await createTeam()
      const away = await createTeam()
      // an unrelated match exists in the DB, with no championship link
      await seedMatch(home.id, away.id)

      const admin = await createAdmin()
      const res = await agent.get(`/matches?championshipId=${emptyChamp.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  // ─── getMatches / getMatch — display data enrichment ───────────────────────
  describe('getMatches, getMatch — championshipName/stageName/homeTeam/awayTeam enrichment', () => {
    it('règle métier: group match resolves championshipName, stageName and team summaries', async () => {
      const cat = await createAgeCategory({ label: 'U13' })
      const champ = await seedChampionship(cat.id)
      const phase = await createPhase(champ.id)
      const home = await createTeam()
      const away = await createTeam()
      const group = await createGroup(phase.id, { name: 'Poule A', teamIds: [home.id, away.id] })
      const match = await seedMatch(home.id, away.id, { groupId: group.id })

      const admin = await createAdmin()
      const listRes = await agent.get('/matches').set(authHeaderFor(admin.id, true))
      const detailRes = await agent.get(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      const expected = {
        championshipName: champ.name,
        stageName: 'Poule A',
        homeTeam: { id: home.id, name: home.name, color: home.color },
        awayTeam: { id: away.id, name: away.name, color: away.color },
      }
      expect(listRes.body[0]).toMatchObject(expected)
      expect(detailRes.body).toMatchObject(expected)
    })

    it('règle métier: bracket match resolves championshipName and stageName from the bracket', async () => {
      const cat = await createAgeCategory({ label: 'U11' })
      const champ = await seedChampionship(cat.id)
      const phase = await createPhase(champ.id, { type: 'KNOCKOUT' })
      const bracket = await prisma.bracket.create({ data: { phaseId: phase.id, name: 'Demi-finale' } })
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { bracketId: bracket.id, groupId: undefined })

      const admin = await createAdmin()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.body).toMatchObject({ championshipName: champ.name, stageName: 'Demi-finale' })
    })

    it('règle métier: match without group/bracket/teams returns null display fields', async () => {
      const match = await prisma.match.create({
        data: { area: makeArea(), status: 'SCHEDULED' },
        select: seedMatchSelect,
      })

      const admin = await createAdmin()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

      expect(res.body).toMatchObject({
        championshipName: null,
        stageName: null,
        homeTeam: null,
        awayTeam: null,
      })
    })
  })

  // ─── getMatch ─────────────────────────────────────────────────────────────
  describe('getMatch — GET /match/{id}', () => {
    it('nominal: returns match by id', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const admin = await createAdmin()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

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

    it('403 — non-admin user', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('404 — unknown match id', async () => {
      const admin = await createAdmin()
      const res = await agent.get(`/match/${unknownObjectId()}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })

    it('règle métier: soft-deleted match returns 404', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      await prisma.match.update({ where: { id: match.id }, data: { deletedAt: new Date() } })

      const admin = await createAdmin()
      const res = await agent.get(`/match/${match.id}`).set(authHeaderFor(admin.id, true))

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

    it('règle métier: admin records score of a match with no area assigned (area: null)', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id, { area: null })

      const res = await agent
        .patch(`/match/${match.id}`)
        .set(authHeaderFor(admin.id, true))
        .send(matchBody(home.id, away.id, { area: null, status: 'PLAYED', homeGoals: 2, awayGoals: 1 }))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: match.id, status: 'PLAYED', homeGoals: 2, awayGoals: 1 })
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
      const listRes = await agent.get('/matches').set(authHeaderFor(admin.id, true))
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
