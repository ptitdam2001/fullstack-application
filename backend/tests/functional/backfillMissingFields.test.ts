import { MongoClient, ObjectId, type Db } from 'mongodb'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { backfillMissingFields } from '../../scripts/backfillMissingFields.js'
import { resetDatabase } from '../support/database.js'
import { createUser } from '../support/fixtures.js'

const unsetTokenVersion = (db: Db, id: string) =>
  db.collection('users').updateOne({ _id: new ObjectId(id) }, { $unset: { tokenVersion: '' } })

const tokenVersionOf = async (db: Db, id: string): Promise<unknown> =>
  (await db.collection('users').findOne({ _id: new ObjectId(id) }))?.tokenVersion

// Prisma reads a missing field as its @default but `increment` writes null on it: without the backfill, a
// password change would never revoke the sessions of a user stored before tokenVersion existed (#54).
describe('backfillMissingFields (run by pnpm db:push)', () => {
  let client: MongoClient
  let db: Db

  beforeAll(async () => {
    client = new MongoClient(process.env.DATABASE_URL!)
    await client.connect()
    db = client.db()
  })

  afterAll(async () => {
    await client.close()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('sets tokenVersion to 0 on the users that lack it, and reports how many', async () => {
    const legacy = await createUser()
    await unsetTokenVersion(db, legacy.id)

    const report = await backfillMissingFields(db)

    expect(await tokenVersionOf(db, legacy.id)).toBe(0)
    expect(report).toEqual([{ collection: 'users', field: 'tokenVersion', updated: 1 }])
  })

  it('leaves an existing tokenVersion untouched', async () => {
    const user = await createUser()
    await db.collection('users').updateOne({ _id: new ObjectId(user.id) }, { $set: { tokenVersion: 3 } })

    const report = await backfillMissingFields(db)

    expect(await tokenVersionOf(db, user.id)).toBe(3)
    expect(report).toEqual([{ collection: 'users', field: 'tokenVersion', updated: 0 }])
  })
})
