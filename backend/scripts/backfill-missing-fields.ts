// Run by `pnpm db:push`, after `prisma db push`: gives a value to the fields that documents stored before
// the field existed lack (see backfillMissingFields.ts). Idempotent.
import 'dotenv/config'
import chalk from 'chalk'
import { MongoClient } from 'mongodb'
import { backfillMissingFields } from './backfillMissingFields.js'

const main = async (): Promise<number> => {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error(chalk.red('DATABASE_URL is not set (backend/.env or environment).'))
    return 1
  }

  const client = new MongoClient(databaseUrl)
  await client.connect()
  try {
    for (const { collection, field, updated } of await backfillMissingFields(client.db())) {
      console.log(`  ${chalk.green('ok')}   ${collection}.${field}: ${updated} document(s) backfilled`)
    }
    return 0
  } finally {
    await client.close()
  }
}

try {
  process.exitCode = await main()
} catch (error) {
  console.error(chalk.red(`Backfill failed: ${error instanceof Error ? error.message : String(error)}`))
  process.exitCode = 1
}
