import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createChampionship, createGroup, createPhase, createTeam } from '../support/fixtures.js'

/** MongoDB rejects non-ObjectId strings on @db.ObjectId fields with a 500.
 *  Use a well-formed but absent ObjectId for "unknown id" cases. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

describe('standings domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('getGroupStandings — GET /group/{groupId}/standings', () => {
    it('nominal: computes standings from played matches without authentication', async () => {
      const championship = await createChampionship({ pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 } })
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const group = await createGroup(phase.id, { teamIds: [teamA.id, teamB.id] })
      await prisma.match.create({
        data: { groupId: group.id, status: 'PLAYED', homeTeamId: teamA.id, awayTeamId: teamB.id, homeGoals: 2, awayGoals: 1 },
      })

      const res = await agent.get(`/group/${group.id}/standings`)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        groupId: group.id,
        rows: [
          {
            rank: 1,
            teamId: teamA.id,
            played: 1,
            won: 1,
            drawn: 0,
            lost: 0,
            forfeited: 0,
            goalsFor: 2,
            goalsAgainst: 1,
            goalDifference: 1,
            points: 3,
          },
          {
            rank: 2,
            teamId: teamB.id,
            played: 1,
            won: 0,
            drawn: 0,
            lost: 1,
            forfeited: 0,
            goalsFor: 1,
            goalsAgainst: 2,
            goalDifference: -1,
            points: 0,
          },
        ],
      })
    })

    it('404 — unknown groupId', async () => {
      const res = await agent.get(`/group/${unknownObjectId()}/standings`)

      expect(res.status).toBe(404)
    })

    it('règle métier: cancelled matches are not counted', async () => {
      const championship = await createChampionship()
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const group = await createGroup(phase.id, { teamIds: [teamA.id, teamB.id] })
      await prisma.match.create({
        data: { groupId: group.id, status: 'CANCELLED', homeTeamId: teamA.id, awayTeamId: teamB.id, homeGoals: 2, awayGoals: 1 },
      })

      const res = await agent.get(`/group/${group.id}/standings`)

      expect(res.status).toBe(200)
      const a = res.body.rows.find((r: { teamId: string }) => r.teamId === teamA.id)
      expect(a).toMatchObject({ played: 0, points: 0 })
    })

    it('règle métier: forfeited match credits the forfeit points to the forfeiting team and a win to the opponent', async () => {
      const championship = await createChampionship({ pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 1 } })
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const group = await createGroup(phase.id, { teamIds: [teamA.id, teamB.id] })
      await prisma.match.create({
        data: { groupId: group.id, status: 'FORFEITED', homeTeamId: teamA.id, awayTeamId: teamB.id, forfeitedBy: teamA.id },
      })

      const res = await agent.get(`/group/${group.id}/standings`)

      expect(res.status).toBe(200)
      const a = res.body.rows.find((r: { teamId: string }) => r.teamId === teamA.id)
      const b = res.body.rows.find((r: { teamId: string }) => r.teamId === teamB.id)
      expect(a).toMatchObject({ played: 1, forfeited: 1, points: 1 })
      expect(b).toMatchObject({ played: 1, won: 1, points: 3 })
    })

    it('règle métier: head-to-head result breaks a tie on overall points', async () => {
      const championship = await createChampionship({ pointsConfig: { win: 3, draw: 1, loss: 0, forfeit: 0 } })
      const phase = await createPhase(championship.id)
      const teamA = await createTeam()
      const teamB = await createTeam()
      const teamC = await createTeam()
      const group = await createGroup(phase.id, { teamIds: [teamA.id, teamB.id, teamC.id] })
      // A beats B 3-0 (head-to-head), C beats A, B beats C → A, B and C all reach 3pts
      await prisma.match.createMany({
        data: [
          { groupId: group.id, status: 'PLAYED', homeTeamId: teamA.id, awayTeamId: teamB.id, homeGoals: 3, awayGoals: 0 },
          { groupId: group.id, status: 'PLAYED', homeTeamId: teamC.id, awayTeamId: teamA.id, homeGoals: 1, awayGoals: 0 },
          { groupId: group.id, status: 'PLAYED', homeTeamId: teamB.id, awayTeamId: teamC.id, homeGoals: 1, awayGoals: 0 },
        ],
      })

      const res = await agent.get(`/group/${group.id}/standings`)

      expect(res.status).toBe(200)
      expect(res.body.rows.every((r: { points: number }) => r.points === 3)).toBe(true)
      const aIndex = res.body.rows.findIndex((r: { teamId: string }) => r.teamId === teamA.id)
      const bIndex = res.body.rows.findIndex((r: { teamId: string }) => r.teamId === teamB.id)
      expect(aIndex).toBeLessThan(bIndex)
    })
  })
})