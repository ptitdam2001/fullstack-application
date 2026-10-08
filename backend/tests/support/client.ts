import supertest from 'supertest'
import { createApp } from '../../createApp'
import { listenOnLoopback } from './loopbackServer'

/**
 * Drives the Express app in-memory (no `listen()`), see `createApp.ts` and ADR-0001.
 * Build a fresh agent per test file (in `beforeAll`) — `createApp` re-initializes
 * `OpenAPIBackend`, which is cheap and keeps test files isolated from each other.
 */
export const createTestAgent = async () => supertest(await listenOnLoopback(await createApp()))
