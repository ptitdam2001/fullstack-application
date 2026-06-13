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

const seedMatch = (homeTeamId: string, awayTeamId: string) =>
  prisma.match.create({
    data: { homeTeamId, awayTeamId, area: makeArea() },
    select: { id: true, homeTeamId: true, awayTeamId: true, status: true },
  })

describe('match/referees domain — functional API (UserMatch)', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── getMatchReferees ─────────────────────────────────────────────────────
  describe('getMatchReferees — GET /match/{matchId}/referees', () => {
    it('nominal: returns empty array when no referees assigned', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}/referees`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('nominal: returns referee assignment records', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}/referees`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0]).toMatchObject({
        id: expect.any(String),
        userId: referee.id,
        matchId: match.id,
      })
    })

    it('nominal: returns all referees for a match with multiple assignments', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const ref1 = await createUser()
      const ref2 = await createUser()
      await prisma.userMatch.create({ data: { userId: ref1.id, matchId: match.id } })
      await prisma.userMatch.create({ data: { userId: ref2.id, matchId: match.id } })

      const user = await createUser()
      const res = await agent.get(`/match/${match.id}/referees`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
    })

    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const res = await agent.get(`/match/${match.id}/referees`)

      expect(res.status).toBe(401)
    })

    it('returns empty array for unknown matchId (list-by-FK, no 404)', async () => {
      const user = await createUser()
      const res = await agent.get(`/match/${unknownObjectId()}/referees`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })

  // ─── assignReferee ────────────────────────────────────────────────────────
  describe('assignReferee — POST /match/{matchId}/referee/{userId}', () => {
    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      const res = await agent.post(`/match/${match.id}/referee/${referee.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      const res = await agent
        .post(`/match/${match.id}/referee/${referee.id}`)
        .set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin assigns referee to match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()

      const res = await agent
        .post(`/match/${match.id}/referee/${referee.id}`)
        .set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(201)
      expect(res.body).toMatchObject({
        id: expect.any(String),
        userId: referee.id,
        matchId: match.id,
      })

      const persisted = await prisma.userMatch.findFirst({ where: { userId: referee.id, matchId: match.id } })
      expect(persisted).not.toBeNull()
    })

    it('nominal: admin can assign multiple different referees to same match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const ref1 = await createUser()
      const ref2 = await createUser()

      await agent.post(`/match/${match.id}/referee/${ref1.id}`).set(authHeaderFor(admin.id, true))
      const res = await agent.post(`/match/${match.id}/referee/${ref2.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(201)
      const count = await prisma.userMatch.count({ where: { matchId: match.id } })
      expect(count).toBe(2)
    })

    it('règle métier: 409 — assigning same referee twice returns Conflict', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()

      await agent.post(`/match/${match.id}/referee/${referee.id}`).set(authHeaderFor(admin.id, true))
      const res = await agent.post(`/match/${match.id}/referee/${referee.id}`).set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(409)
      expect(res.body).toMatchObject({ status: 409 })
    })
  })

  // ─── removeReferee ────────────────────────────────────────────────────────
  describe('removeReferee — DELETE /match/{matchId}/referee/{userId}', () => {
    it('401 — unauthenticated request', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })
      const res = await agent.delete(`/match/${match.id}/referee/${referee.id}`)

      expect(res.status).toBe(401)
    })

    it('403 — non-admin user', async () => {
      const user = await createUser()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })
      const res = await agent
        .delete(`/match/${match.id}/referee/${referee.id}`)
        .set(authHeaderFor(user.id))

      expect(res.status).toBe(403)
    })

    it('nominal: admin removes a referee from a match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match.id } })

      const res = await agent
        .delete(`/match/${match.id}/referee/${referee.id}`)
        .set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(204)
      const persisted = await prisma.userMatch.findFirst({ where: { userId: referee.id, matchId: match.id } })
      expect(persisted).toBeNull()
    })

    it('404 — referee not assigned to match', async () => {
      const admin = await createAdmin()
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const referee = await createUser()

      const res = await agent
        .delete(`/match/${match.id}/referee/${referee.id}`)
        .set(authHeaderFor(admin.id, true))

      expect(res.status).toBe(404)
      expect(res.body).toMatchObject({ status: 404 })
    })
  })

  // ─── getUserMatches ───────────────────────────────────────────────────────
  describe('getUserMatches — GET /user/{userId}/referee-matches', () => {
    it('nominal: returns empty array for user with no assignments', async () => {
      const user = await createUser()
      const res = await agent.get(`/user/${user.id}/referee-matches`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('nominal: returns all match assignments for a referee', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match1 = await seedMatch(home.id, away.id)
      const match2 = await seedMatch(home.id, away.id)
      const referee = await createUser()
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match1.id } })
      await prisma.userMatch.create({ data: { userId: referee.id, matchId: match2.id } })

      const res = await agent.get(`/user/${referee.id}/referee-matches`).set(authHeaderFor(referee.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
      const matchIds = res.body.map((um: { matchId: string }) => um.matchId)
      expect(matchIds).toContain(match1.id)
      expect(matchIds).toContain(match2.id)
    })

    it('nominal: does not return assignments of other users', async () => {
      const home = await createTeam()
      const away = await createTeam()
      const match = await seedMatch(home.id, away.id)
      const ref1 = await createUser()
      const ref2 = await createUser()
      await prisma.userMatch.create({ data: { userId: ref1.id, matchId: match.id } })

      const res = await agent.get(`/user/${ref2.id}/referee-matches`).set(authHeaderFor(ref2.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(0)
    })

    it('401 — unauthenticated request', async () => {
      const user = await createUser()
      const res = await agent.get(`/user/${user.id}/referee-matches`)

      expect(res.status).toBe(401)
    })

    it('returns empty array for unknown userId (list-by-FK, no 404)', async () => {
      const user = await createUser()
      const res = await agent.get(`/user/${unknownObjectId()}/referee-matches`).set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })
  })
})