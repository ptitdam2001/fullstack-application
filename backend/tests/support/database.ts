import { execFileSync } from 'node:child_process'
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers'

/**
 * Single place that knows about the database engine for functional tests (ADR-0002).
 * Swapping engines later means changing only this file: the image, the
 * connection string builder, the migration command, and `resetDatabase`.
 *
 * Image kept in sync with the `mongodb` service in the root `docker-compose.yml` —
 * a replica-set build is required because Prisma+MongoDB needs one for `$transaction()`.
 *
 * Credentials below are throwaway values for an ephemeral, localhost-only
 * container — deliberately NOT read from `.env`. Reusing dev/prod values would
 * couple the test suite to the developer's local config (and `.env` may not
 * even exist in CI, only `.env.sample`).
 */
const MONGO_IMAGE = 'prismagraphql/mongo-single-replica:4.4.3-bionic'
const MONGO_PORT = 27017
const ROOT_USERNAME = 'test'
const ROOT_PASSWORD = 'test'
const DATABASE_NAME = 'test'

const PUSH_RETRY_ATTEMPTS = 10
const PUSH_RETRY_DELAY_MS = 2_000

let container: StartedTestContainer | undefined

const buildDatabaseUrl = (host: string, port: number): string =>
  `mongodb://${ROOT_USERNAME}:${ROOT_PASSWORD}@${host}:${port}/${DATABASE_NAME}?authSource=admin&directConnection=true`

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * `prisma db push` can fail for the first seconds after the port opens —
 * the image still finalizes replica-set initiation in the background. Retry
 * instead of guessing a fixed boot delay or parsing log messages.
 */
const pushSchema = (databaseUrl: string): void => {
  execFileSync('npx', ['prisma', 'db', 'push', '--skip-generate'], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  })
}

const pushSchemaWithRetry = async (databaseUrl: string): Promise<void> => {
  let lastError: unknown
  for (let attempt = 1; attempt <= PUSH_RETRY_ATTEMPTS; attempt++) {
    try {
      pushSchema(databaseUrl)
      return
    } catch (error) {
      lastError = error
      await sleep(PUSH_RETRY_DELAY_MS)
    }
  }
  throw new Error(`Failed to push Prisma schema to test container after ${PUSH_RETRY_ATTEMPTS} attempts`, {
    cause: lastError,
  })
}

/**
 * Vitest globalSetup: starts the container and exposes DATABASE_URL via
 * process.env *before* any test file imports the Prisma singleton
 * (`utils/prismaClient.ts`), which instantiates `PrismaClient` at import time.
 */
export const setup = async (): Promise<void> => {
  container = await new GenericContainer(MONGO_IMAGE)
    .withEnvironment({
      MONGO_INITDB_DATABASE: DATABASE_NAME,
      MONGO_INITDB_ROOT_USERNAME: ROOT_USERNAME,
      MONGO_INITDB_ROOT_PASSWORD: ROOT_PASSWORD,
      // The image's entrypoint kills the bootstrap mongod, waits this long, then
      // reconnects to init the replica set. Under amd64-on-arm64 emulation (Apple
      // Silicon) mongod isn't back up within 1s — bump it so init doesn't race the restart.
      INIT_WAIT_SEC: '10',
    })
    .withExposedPorts(MONGO_PORT)
    .withWaitStrategy(Wait.forListeningPorts())
    .withStartupTimeout(120_000)
    .start()

  const databaseUrl = buildDatabaseUrl(container.getHost(), container.getMappedPort(MONGO_PORT))
  process.env.DATABASE_URL = databaseUrl

  await pushSchemaWithRetry(databaseUrl)
}

export const teardown = async (): Promise<void> => {
  await container?.stop()
  container = undefined
}

/**
 * Wipes every collection between test files — faster than restarting the
 * container. Dynamic import: `prismaClient` instantiates `PrismaClient` at
 * import time, and must only do so once `DATABASE_URL` points at the
 * container (i.e. after `setup()` has run, when test files call this).
 */
export const resetDatabase = async (): Promise<void> => {
  const { prisma } = await import('../../utils/prismaClient')
  await Promise.all([
    prisma.championship.deleteMany({}),
    prisma.phase.deleteMany({}),
    prisma.group.deleteMany({}),
    prisma.groupTeam.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.area.deleteMany({}),
    prisma.team.deleteMany({}),
    prisma.player.deleteMany({}),
    prisma.userTeam.deleteMany({}),
    prisma.match.deleteMany({}),
    prisma.teamJoinRequest.deleteMany({}),
    prisma.userMatch.deleteMany({}),
  ])
}
