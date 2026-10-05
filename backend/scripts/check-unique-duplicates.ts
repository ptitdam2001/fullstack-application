// Read-only pre-flight for `pnpm db:push`: lists the documents that would make MongoDB refuse a
// unique index declared in prisma/schema.prisma (`@unique`, `@@unique`).
// With MongoDB those indexes only exist once `prisma db push` has run; on a database that lived
// without them, duplicates may have slipped past the application checks. On the project's Mongo 4.4
// image the push then does not fail: the index build stays blocked on the server, hence this check
// before any write. Unique sets come from the generated Prisma client — run `pnpm generate:prisma` first.
// A missing field counts as null, exactly as in a (non-sparse) MongoDB unique index.
import 'dotenv/config'
import { Prisma } from '@prisma/client'
import chalk from 'chalk'
import { MongoClient, type Db, type Document } from 'mongodb'

type UniqueSet = { model: string; collection: string; fields: string[] }
type DuplicateGroup = { _id: Record<string, unknown>; count: number; ids: unknown[] }

const MAX_GROUPS_SHOWN = 20
const MAX_IDS_SHOWN = 5

const collectUniqueSets = (): UniqueSet[] => {
  const sets = new Map<string, UniqueSet>()
  for (const model of Prisma.dmmf.datamodel.models) {
    const collection = model.dbName ?? model.name
    const dbNameOf = (fieldName: string): string =>
      model.fields.find(field => field.name === fieldName)?.dbName ?? fieldName
    const single = model.fields.filter(field => field.isUnique).map(field => [field.name])
    for (const fieldNames of [...single, ...model.uniqueFields]) {
      const fields = fieldNames.map(dbNameOf)
      sets.set(`${collection}:${fields.join(',')}`, { model: model.name, collection, fields })
    }
  }
  return [...sets.values()]
}

const findDuplicates = (db: Db, { collection, fields }: UniqueSet): Promise<DuplicateGroup[]> => {
  const key: Document = {}
  for (const field of fields) {
    key[field] = { $ifNull: [`$${field}`, null] }
  }
  return db
    .collection(collection)
    .aggregate<DuplicateGroup>(
      [
        { $group: { _id: key, count: { $sum: 1 }, ids: { $push: '$_id' } } },
        { $match: { count: { $gt: 1 } } },
        { $sort: { count: -1 } },
        { $limit: MAX_GROUPS_SHOWN },
        { $project: { count: 1, ids: { $slice: ['$ids', MAX_IDS_SHOWN] } } },
      ],
      { allowDiskUse: true }
    )
    .toArray()
}

const describeTarget = (databaseUrl: string): string => {
  const url = new URL(databaseUrl)
  return `${url.host}${url.pathname}`
}

const main = async (): Promise<number> => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error(chalk.red('DATABASE_URL is not set (backend/.env or environment).'))
    return 1
  }

  const client = new MongoClient(databaseUrl)
  await client.connect()
  try {
    const db = client.db()
    console.log(`Checking unique fields for duplicates on ${chalk.cyan(describeTarget(databaseUrl))} (read-only)`)

    let conflicts = 0
    for (const uniqueSet of collectUniqueSets()) {
      const label = `${uniqueSet.collection} (${uniqueSet.fields.join(', ')})`
      const groups = await findDuplicates(db, uniqueSet)
      if (groups.length === 0) {
        console.log(`  ${chalk.green('ok')}   ${label}`)
        continue
      }
      conflicts += 1
      console.log(`  ${chalk.red('dup')}  ${label}`)
      for (const group of groups) {
        const ids = group.ids.map(String).join(', ')
        const more = group.count > group.ids.length ? ', …' : ''
        console.log(`         ${JSON.stringify(group._id)} × ${group.count} — _id: ${ids}${more}`)
      }
    }

    if (conflicts > 0) {
      console.error(
        chalk.red(
          `\n${conflicts} unique index(es) cannot be created: merge or delete the duplicates above, then run again.`
        )
      )
      return 1
    }
    console.log(chalk.green('\nNo duplicates: the unique indexes can be created.'))
    return 0
  } finally {
    await client.close()
  }
}

try {
  process.exitCode = await main()
} catch (error) {
  console.error(chalk.red(`Duplicate check failed: ${error instanceof Error ? error.message : String(error)}`))
  process.exitCode = 1
}
