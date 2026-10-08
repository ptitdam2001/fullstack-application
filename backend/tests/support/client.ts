import type { Stream } from 'node:stream'
import supertest from 'supertest'
import { createApp } from '../../createApp'
import { listenOnLoopback } from './loopbackServer'

/**
 * Drives the Express app through a loopback-only server (see `loopbackServer.ts`), `createApp.ts` and ADR-0001.
 * Build a fresh agent per test file (in `beforeAll`) — `createApp` re-initializes
 * `OpenAPIBackend`, which is cheap and keeps test files isolated from each other.
 */
export const createTestAgent = async () => supertest(await listenOnLoopback(await createApp()))

/** supertest only buffers bodies it knows how to parse: collects a binary body (an image) as raw bytes. */
export const binaryParser = (res: Stream, callback: (err: Error | null, body: Buffer) => void): void => {
  const chunks: Buffer[] = []
  res.on('data', (chunk: Buffer) => chunks.push(chunk))
  res.on('end', () => callback(null, Buffer.concat(chunks)))
}
