import { execFileSync } from 'node:child_process'
import { MongoClient } from 'mongodb'
import { GenericContainer, Wait, type StartedTestContainer } from 'testcontainers'

/**
 * Single place that knows about the database engine for functional tests (ADR-0002).
 * Swapping engines later means changing only this file: the image, the
 * connection string builder, the migration command, and `resetDatabase`.
 *
 * Image and start-up kept in sync with the `mongodb` service of `deployment/docker-compose.yml` —
 * a replica set is required because Prisma+MongoDB needs one for `$transaction()`.
 *
 * Credentials below are throwaway values for an ephemeral, localhost-only
 * container — deliberately NOT read from `.env`. Reusing dev/prod values would
 * couple the test suite to the developer's local config (and `.env` may not
 * even exist in CI, only `.env.sample`).
 */
const MONGO_IMAGE = 'mongo:9.0'
const MONGO_PORT = 27017
const REPLICA_SET_NAME = 'rs0'
const KEY_FILE = '/tmp/mongo-keyfile'
const ROOT_USERNAME = 'test'
const ROOT_PASSWORD = 'test'
const DATABASE_NAME = 'test'

// mongod refuses a replica set with authentication unless it gets a key file. With a single node
// nobody else reads that key, so it is generated when the container starts.
const START_MONGOD = [
  `openssl rand -base64 756 > ${KEY_FILE}`,
  `chmod 400 ${KEY_FILE}`,
  `chown mongodb:mongodb ${KEY_FILE}`,
  `exec docker-entrypoint.sh mongod --replSet ${REPLICA_SET_NAME} --bind_ip_all --keyFile ${KEY_FILE}`,
].join(' && ')

// Initiates the replica set when there is none, then succeeds once this node is primary.
const INITIATE_REPLICA_SET_AND_CHECK_PRIMARY = `try { rs.status() } catch (e) { rs.initiate({ _id: '${REPLICA_SET_NAME}', members: [{ _id: 0, host: 'localhost:${MONGO_PORT}' }] }) } quit(db.hello().isWritablePrimary ? 0 : 1)`

const PUSH_RETRY_ATTEMPTS = 10
const PUSH_RETRY_DELAY_MS = 2_000

let container: StartedTestContainer | undefined

const buildDatabaseUrl = (host: string, port: number): string =>
  `mongodb://${ROOT_USERNAME}:${ROOT_PASSWORD}@${host}:${port}/${DATABASE_NAME}?authSource=admin&directConnection=true`

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * The container is reported started once its healthcheck passes, that is once the node is
 * primary. The retry stays as a safety net for a `prisma db push` that fails right after that.
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
    })
    .withEntrypoint(['bash', '-c', START_MONGOD])
    .withExposedPorts(MONGO_PORT)
    .withHealthCheck({
      test: [
        'CMD',
        'mongosh',
        '--quiet',
        '-u',
        ROOT_USERNAME,
        '-p',
        ROOT_PASSWORD,
        '--authenticationDatabase',
        'admin',
        '--eval',
        INITIATE_REPLICA_SET_AND_CHECK_PRIMARY,
      ],
      interval: 2_000,
      timeout: 5_000,
      retries: 30,
    })
    .withWaitStrategy(Wait.forHealthCheck())
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
  // Use the native MongoDB driver — NOT Prisma — for cleanup.
  //
  // Prisma 6.x + MongoDB: deleteMany() and $runCommandRaw() both resolve their
  // Promises before MongoDB applies the write (fire-and-forget), causing deferred
  // deletes to race with the test body. Wrapping in $transaction causes write
  // conflicts because Prisma spawns internal sessions for application-level
  // Restrict checks. The native driver's deleteMany() resolves only after the
  // write is acknowledged by MongoDB, with no Prisma-level FK checks.
  const client = new MongoClient(process.env.DATABASE_URL!)
  await client.connect()
  try {
    const db = client.db()
    // All collections can be cleared in parallel — no FK constraints at driver level.
    await Promise.all([
      db.collection('userMatches').deleteMany({}),
      db.collection('matches').deleteMany({}),
      db.collection('players').deleteMany({}),
      db.collection('userTeams').deleteMany({}),
      db.collection('teamJoinRequests').deleteMany({}),
      db.collection('groupTeams').deleteMany({}),
      db.collection('teams').deleteMany({}),
      db.collection('users').deleteMany({}),
      db.collection('images').deleteMany({}),
      db.collection('groups').deleteMany({}),
      db.collection('phases').deleteMany({}),
      db.collection('championships').deleteMany({}),
      db.collection('seasons').deleteMany({}),
      db.collection('areas').deleteMany({}),
    ])
  } finally {
    await client.close()
  }
}
