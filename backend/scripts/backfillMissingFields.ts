import type { Db } from 'mongodb'

type Backfill = { collection: string; field: string; value: unknown }
export type BackfillReport = { collection: string; field: string; updated: number }[]

// Fields added to a model after documents were stored. Prisma reads a missing field as its @default, but
// its atomic operators (`increment`…) write null on it: the field must really exist. Sets the default only
// where the field is missing, so running it again changes nothing.
const BACKFILLS: Backfill[] = [{ collection: 'users', field: 'tokenVersion', value: 0 }]

export const backfillMissingFields = async (db: Db): Promise<BackfillReport> => {
  const report: BackfillReport = []
  for (const { collection, field, value } of BACKFILLS) {
    const { modifiedCount } = await db
      .collection(collection)
      .updateMany({ [field]: { $exists: false } }, { $set: { [field]: value } })
    report.push({ collection, field, updated: modifiedCount })
  }
  return report
}
