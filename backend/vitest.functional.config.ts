import { defineConfig } from 'vitest/config'

/**
 * Separate suite for functional API tests (ADR-0001) — keeps `vitest.config.ts`
 * (fast unit tests, mocked repositories) untouched and able to run independently.
 *
 * Requires Docker: `globalSetup` starts a MongoDB replica-set container via
 * testcontainers (see `tests/support/database.ts` / ADR-0002).
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/functional/**/*.test.ts'],
    globalSetup: ['./tests/support/database.ts'],
    // Run test files sequentially against the single shared container — each
    // file resets the database (tests/support/database.ts#resetDatabase),
    // parallel files would wipe each other's fixtures mid-run.
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 30_000,
    hookTimeout: 120_000,
    // Dedicated test-only values — independent from `.env` (see tests/support/database.ts
    // for why functional tests must not depend on the developer's local config).
    env: {
      JWT_SECRET: 'functional-test-secret',
      JWT_EXPIRE: '7200',
      FRONTEND_URL: 'http://localhost:5173',
      MAX_LOGIN_ATTEMPTS: '5',
      ACTIVATION_TOKEN_EXPIRY_HOURS: '48',
    },
  },
})
