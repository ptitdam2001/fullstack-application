import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createArea, createUser } from '../support/fixtures.js'

describe('area domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('getAreaList — pagination', () => {
    const seedAreas = async (n: number) => {
      for (let i = 0; i < n; i++) {
        await createArea()
      }
    }
    const ids = (body: { id: string }[]) => body.map(area => area.id)

    it('page=1 is the first page, with no overlap between pages', async () => {
      await seedAreas(5)
      const user = await createUser()

      const first = await agent.get('/areas?page=1&count=2').set(authHeaderFor(user.id))
      const second = await agent.get('/areas?page=2&count=2').set(authHeaderFor(user.id))
      const last = await agent.get('/areas?page=3&count=2').set(authHeaderFor(user.id))

      expect(first.status).toBe(200)
      expect(first.body).toHaveLength(2)
      expect(second.body).toHaveLength(2)
      expect(last.body).toHaveLength(1)
      expect(new Set([...ids(first.body), ...ids(second.body), ...ids(last.body)]).size).toBe(5)
    })

    it('without page returns the first page', async () => {
      await seedAreas(3)
      const user = await createUser()

      const withoutPage = await agent.get('/areas?count=2').set(authHeaderFor(user.id))
      const firstPage = await agent.get('/areas?page=1&count=2').set(authHeaderFor(user.id))

      expect(ids(withoutPage.body)).toEqual(ids(firstPage.body))
    })

    it('page below 1 falls back to the first page', async () => {
      await seedAreas(3)
      const user = await createUser()

      const zero = await agent.get('/areas?page=0&count=2').set(authHeaderFor(user.id))
      const firstPage = await agent.get('/areas?page=1&count=2').set(authHeaderFor(user.id))

      expect(ids(zero.body)).toEqual(ids(firstPage.body))
    })

    it('without count returns 20 areas', async () => {
      await seedAreas(21)
      const user = await createUser()

      const res = await agent.get('/areas').set(authHeaderFor(user.id))

      expect(res.body).toHaveLength(20)
    })

    it('caps count at 100', async () => {
      await seedAreas(101)
      const user = await createUser()

      const res = await agent.get('/areas?page=1&count=500').set(authHeaderFor(user.id))

      expect(res.body).toHaveLength(100)
    })
  })
})
