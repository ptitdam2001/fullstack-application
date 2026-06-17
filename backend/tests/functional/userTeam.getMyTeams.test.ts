import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { TeamRole } from '@prisma/client'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { assignUserToTeam, createTeam, createUser } from '../support/fixtures.js'

describe('userTeam — getMyTeams — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('GET /me/teams', () => {
    it('returns empty array when user has no team memberships', async () => {
      const user = await createUser()

      const res = await agent.get('/me/teams').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toEqual([])
    })

    it('returns all teams for user regardless of role', async () => {
      const user = await createUser()
      const team1 = await createTeam({ name: 'Alpha' })
      const team2 = await createTeam({ name: 'Beta' })
      await assignUserToTeam(user.id, team1.id, TeamRole.COACH)
      await assignUserToTeam(user.id, team2.id, TeamRole.PLAYER)

      const res = await agent.get('/me/teams').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
      const teamIds = res.body.map((ut: { teamId: string }) => ut.teamId)
      expect(teamIds).toContain(team1.id)
      expect(teamIds).toContain(team2.id)
    })

    it('response shape includes embedded team data', async () => {
      const user = await createUser()
      const team = await createTeam({ name: 'Omega' })
      await assignUserToTeam(user.id, team.id, TeamRole.COACH)

      const res = await agent.get('/me/teams').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body[0]).toMatchObject({
        userId: user.id,
        teamId: team.id,
        role: TeamRole.COACH,
        team: { id: team.id, name: 'Omega' },
      })
    })

    it('only returns teams for the authenticated user, not other users', async () => {
      const user = await createUser()
      const other = await createUser()
      const team1 = await createTeam()
      const team2 = await createTeam()
      await assignUserToTeam(user.id, team1.id, TeamRole.COACH)
      await assignUserToTeam(other.id, team2.id, TeamRole.PLAYER)

      const res = await agent.get('/me/teams').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(1)
      expect(res.body[0].teamId).toBe(team1.id)
    })

    it('returns 401 without authentication', async () => {
      const res = await agent.get('/me/teams')

      expect(res.status).toBe(401)
    })
  })
})