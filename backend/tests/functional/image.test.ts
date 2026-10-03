import { randomBytes } from 'node:crypto'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createUser } from '../support/fixtures.js'

/** A well-formed but absent ObjectId. */
const unknownObjectId = (): string => randomBytes(12).toString('hex')

// supertest only buffers bodies it knows how to parse: collect image bodies as raw bytes.
const binaryParser = (res: NodeJS.ReadableStream, callback: (err: Error | null, body: Buffer) => void): void => {
  const chunks: Buffer[] = []
  res.on('data', (chunk: Buffer) => chunks.push(chunk))
  res.on('end', () => callback(null, Buffer.concat(chunks)))
}

describe('image domain — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── getImage ───────────────────────────────────────────────────────────
  describe('getImage — GET /images/{id}', () => {
    const storeImage = async (data: Buffer, contentType: string) => {
      const owner = await createUser()
      return prisma.image.create({ data: { data, contentType, size: data.length, ownerId: owner.id } })
    }

    it('nominal: serves the stored bytes with the stored content type, without authentication', async () => {
      const data = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), randomBytes(64)])
      const image = await storeImage(data, 'image/png')

      const res = await agent.get(`/images/${image.id}`).buffer(true).parse(binaryParser)

      expect(res.status).toBe(200)
      expect(res.headers['content-type']).toBe('image/png')
      expect(Number(res.headers['content-length'])).toBe(data.length)
      expect(Buffer.compare(res.body, data)).toBe(0)
    })

    it('is cacheable for good, not sniffable, and loadable from another origin', async () => {
      const image = await storeImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg')

      const res = await agent.get(`/images/${image.id}`)

      expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable')
      expect(res.headers['x-content-type-options']).toBe('nosniff')
      // helmet's default (same-origin) would make the browser block the <img> of the web application
      expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin')
    })

    it('404 — unknown id', async () => {
      const res = await agent.get(`/images/${unknownObjectId()}`)

      expect(res.status).toBe(404)
      expect(res.body).toEqual({ message: 'Image not found', status: 404 })
    })

    it.each(['not-an-object-id', '123', 'zzzzzzzzzzzzzzzzzzzzzzzz', '5f1d7f3e9b1e8a0017a1b2c3d'])(
      '404 — malformed id %s (no 500)',
      async id => {
        const res = await agent.get(`/images/${id}`)

        expect(res.status).toBe(404)
        expect(res.body).toEqual({ message: 'Image not found', status: 404 })
      }
    )
  })
})
