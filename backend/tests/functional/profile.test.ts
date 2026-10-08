import type { Stream } from 'node:stream'
import jwt from 'jsonwebtoken'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '../../utils/prismaClient.js'
import { authHeaderFor } from '../support/authenticate.js'
import { createTestAgent } from '../support/client.js'
import { resetDatabase } from '../support/database.js'
import { createAdmin, createUser, FIXTURE_PASSWORD } from '../support/fixtures.js'
import { MAX_AVATAR_BYTES } from '../../src/user/domain/Avatar.js'

// A real 1×1 PNG
const PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
const PNG_BYTES = Buffer.from(PNG_BASE64, 'base64')

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0]
const WEBP_HEADER = [0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]

/** `size` bytes starting with the given signature — enough for the server, which checks the signature only. */
const fakeImage = (header: number[], size = 64): Buffer => {
  const buffer = Buffer.alloc(size, 0x2a)
  buffer.set(header)
  return buffer
}

const IMAGE_URL = /^\/images\/([A-Za-z0-9_-]{22})$/
const imageIdOf = (avatar: string): string => {
  const match = IMAGE_URL.exec(avatar)
  if (!match) {
    throw new Error(`Not an image url: ${avatar}`)
  }
  return match[1]
}

const binaryParser = (res: Stream, callback: (err: Error | null, body: Buffer) => void): void => {
  const chunks: Buffer[] = []
  res.on('data', (chunk: Buffer) => chunks.push(chunk))
  res.on('end', () => callback(null, Buffer.concat(chunks)))
}

/** A token issued a minute ago — `authHeaderFor` tokens are issued "now", too close to tell before from after. */
const olderAuthHeaderFor = (userId: string): { Authorization: string } => {
  const token = jwt.sign(
    { userId, isAdmin: false, isCoach: false, iat: Math.floor(Date.now() / 1000) - 60 },
    process.env.JWT_SECRET as string,
    { expiresIn: 7200 }
  )
  return { Authorization: `Bearer ${token}` }
}

describe('account page (self-service profile) — functional API', () => {
  let agent: Awaited<ReturnType<typeof createTestAgent>>

  beforeAll(async () => {
    agent = await createTestAgent()
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  // ─── updateMyProfile ────────────────────────────────────────────────────
  describe('updateMyProfile — PATCH /me', () => {
    it('nominal: a non-admin user updates their own first and last name', async () => {
      const user = await createUser()

      const res = await agent.patch('/me').set(authHeaderFor(user.id)).send({ firstName: 'Camille', lastName: 'Roux' })

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({
        id: user.id,
        email: user.email,
        firstName: 'Camille',
        lastName: 'Roux',
        isAdmin: false,
        roles: [],
      })
      expect(res.body).not.toHaveProperty('password')
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored).toMatchObject({ firstName: 'Camille', lastName: 'Roux' })
    })

    it('returns the same shape as GET /me', async () => {
      const user = await createUser()

      const res = await agent.patch('/me').set(authHeaderFor(user.id)).send({ firstName: 'Camille' })
      const me = await agent.get('/me').set(authHeaderFor(user.id))

      expect(res.body).toEqual(me.body)
    })

    it('clears the last name when it is null', async () => {
      const user = await createUser()

      const res = await agent.patch('/me').set(authHeaderFor(user.id)).send({ lastName: null })

      expect(res.status).toBe(200)
      expect(res.body.lastName).toBeNull()
      expect(res.body.firstName).toBe(user.firstName)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.lastName).toBeNull()
    })

    it('only touches the caller, never another user', async () => {
      const user = await createUser()
      const other = await createUser()

      await agent.patch('/me').set(authHeaderFor(user.id)).send({ firstName: 'Camille' })

      const untouched = await prisma.user.findUniqueOrThrow({ where: { id: other.id } })
      expect(untouched.firstName).toBe(other.firstName)
    })

    it.each([
      ['isAdmin', { isAdmin: true }],
      ['email', { email: 'hijack@fixtures.local' }],
      ['avatar', { avatar: '/images/000000000000000000000000' }],
      ['isActive', { isActive: false }],
      ['password', { password: 'Hijacked123' }],
    ])('400 — refuses %s and changes nothing', async (_field, extra) => {
      const user = await createUser()
      const before = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

      const res = await agent
        .patch('/me')
        .set(authHeaderFor(user.id))
        .send({ firstName: 'Camille', ...extra })

      expect(res.status).toBe(400)
      const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(after).toEqual(before)
    })

    it.each([
      ['empty firstName', { firstName: '' }],
      ['blank firstName', { firstName: '   ' }],
      ['empty lastName', { lastName: '' }],
      ['blank lastName', { lastName: '   ' }],
    ])('400 — validation: %s, nothing changes', async (_case, body) => {
      const user = await createUser()
      const before = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

      const res = await agent.patch('/me').set(authHeaderFor(user.id)).send(body)

      expect(res.status).toBe(400)
      const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(after).toEqual(before)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.patch('/me').send({ firstName: 'Camille' })

      expect(res.status).toBe(401)
    })
  })

  // ─── updateMyAvatar ─────────────────────────────────────────────────────
  describe('updateMyAvatar — PUT /me/avatar', () => {
    const upload = (userId: string, data: Buffer | string, contentType = 'image/png') =>
      agent
        .put('/me/avatar')
        .set(authHeaderFor(userId))
        .send({ contentType, data: typeof data === 'string' ? data : data.toString('base64') })

    it('nominal: round trip — the uploaded picture is served back, byte for byte, without Authorization', async () => {
      const user = await createUser()

      const res = await upload(user.id, PNG_BASE64)

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, email: user.email })
      expect(res.body.avatar).toMatch(IMAGE_URL)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.avatar).toBe(res.body.avatar)

      const image = await agent.get(res.body.avatar).buffer(true).parse(binaryParser)
      expect(image.status).toBe(200)
      expect(image.headers['content-type']).toBe('image/png')
      expect(Buffer.compare(image.body, PNG_BYTES)).toBe(0)

      const row = await prisma.image.findUniqueOrThrow({ where: { publicId: imageIdOf(res.body.avatar) } })
      expect(row).toMatchObject({ ownerId: user.id, contentType: 'image/png', size: PNG_BYTES.length })
    })

    it.each([
      ['image/jpeg', JPEG_HEADER],
      ['image/webp', WEBP_HEADER],
    ])('accepts %s', async (contentType, header) => {
      const user = await createUser()
      const data = fakeImage(header)

      const res = await upload(user.id, data, contentType)

      expect(res.status).toBe(200)
      const image = await agent.get(res.body.avatar).buffer(true).parse(binaryParser)
      expect(image.headers['content-type']).toBe(contentType)
      expect(Buffer.compare(image.body, data)).toBe(0)
    })

    it('returns the same shape as GET /me', async () => {
      const user = await createUser()

      const res = await upload(user.id, PNG_BASE64)
      const me = await agent.get('/me').set(authHeaderFor(user.id))

      expect(res.body).toEqual(me.body)
    })

    it('works for an admin too', async () => {
      const admin = await createAdmin()

      const res = await upload(admin.id, PNG_BASE64)

      expect(res.status).toBe(200)
    })

    it('règle métier: replacing the avatar deletes the previous image', async () => {
      const user = await createUser()
      const first = await upload(user.id, PNG_BASE64)
      const firstUrl: string = first.body.avatar

      const second = await upload(user.id, fakeImage(JPEG_HEADER), 'image/jpeg')

      expect(second.status).toBe(200)
      expect(second.body.avatar).not.toBe(firstUrl)
      expect((await agent.get(firstUrl)).status).toBe(404)
      expect((await agent.get(second.body.avatar)).status).toBe(200)
      expect(await prisma.image.count({ where: { ownerId: user.id } })).toBe(1)
    })

    it("leaves other users' images alone", async () => {
      const user = await createUser()
      const other = await createUser()
      const otherUpload = await upload(other.id, PNG_BASE64)

      await upload(user.id, PNG_BASE64)
      await upload(user.id, fakeImage(JPEG_HEADER), 'image/jpeg')

      expect((await agent.get(otherUpload.body.avatar)).status).toBe(200)
    })

    it("never deletes someone else's image, even when the profile was made to point at it", async () => {
      const user = await createUser()
      const other = await createUser()
      const otherUpload = await upload(other.id, PNG_BASE64)
      // What an admin can do through PATCH /user/{id}.
      await prisma.user.update({ where: { id: user.id }, data: { avatar: otherUpload.body.avatar } })

      const replaced = await upload(user.id, fakeImage(JPEG_HEADER), 'image/jpeg')
      const removed = await agent.delete('/me/avatar').set(authHeaderFor(user.id))

      expect(replaced.status).toBe(200)
      expect(removed.status).toBe(200)
      expect((await agent.get(otherUpload.body.avatar)).status).toBe(200)
    })

    describe('concurrent requests of the same user (two tabs, a network retry)', () => {
      const ROUNDS = 5
      const PARALLEL_UPLOADS = 4

      /** The avatar shown by GET /me, which must be served when there is one. */
      const expectAvatarToResolve = async (userId: string): Promise<string | null> => {
        const me = await agent.get('/me').set(authHeaderFor(userId))
        expect(me.status).toBe(200)
        const avatar: string | null = me.body.avatar ?? null
        if (avatar !== null) {
          expect((await agent.get(avatar)).status).toBe(200)
        }
        return avatar
      }

      it('two simultaneous uploads leave an avatar that is served, and no other image', async () => {
        const user = await createUser()

        for (let round = 0; round < ROUNDS; round++) {
          const [first, second] = await Promise.all([
            upload(user.id, PNG_BASE64),
            upload(user.id, fakeImage(JPEG_HEADER), 'image/jpeg'),
          ])

          expect(first.status).toBe(200)
          expect(second.status).toBe(200)
          const avatar = await expectAvatarToResolve(user.id)
          expect([first.body.avatar, second.body.avatar]).toContain(avatar)
          expect(await prisma.image.count({ where: { ownerId: user.id } })).toBe(1)
        }
      })

      it('a burst of uploads leaves an avatar that is served, and no other image', async () => {
        const user = await createUser()
        await upload(user.id, PNG_BASE64)

        const responses = await Promise.all(
          Array.from({ length: PARALLEL_UPLOADS }, () => upload(user.id, fakeImage(JPEG_HEADER), 'image/jpeg'))
        )

        expect(responses.map(res => res.status)).toEqual(Array(PARALLEL_UPLOADS).fill(200))
        expect(await expectAvatarToResolve(user.id)).not.toBeNull()
        expect(await prisma.image.count({ where: { ownerId: user.id } })).toBe(1)
      })

      it('an upload racing with a removal leaves no avatar, or one that is served', async () => {
        const user = await createUser()

        for (let round = 0; round < ROUNDS; round++) {
          const [uploaded, removed] = await Promise.all([
            upload(user.id, PNG_BASE64),
            agent.delete('/me/avatar').set(authHeaderFor(user.id)),
          ])

          expect(uploaded.status).toBe(200)
          expect(removed.status).toBe(200)
          const avatar = await expectAvatarToResolve(user.id)
          expect(await prisma.image.count({ where: { ownerId: user.id } })).toBe(avatar === null ? 0 : 1)
        }
      })
    })

    it('accepts a picture of exactly the size limit (its body is above the default 100 kB JSON limit)', async () => {
      const user = await createUser()

      const res = await upload(user.id, fakeImage(JPEG_HEADER, MAX_AVATAR_BYTES), 'image/jpeg')

      expect(res.status).toBe(200)
    })

    describe('400 — refused, nothing stored, avatar unchanged', () => {
      const expectRefused = async (userId: string, res: { status: number; body: unknown }) => {
        expect(res.status).toBe(400)
        expect(await prisma.image.count()).toBe(0)
        const stored = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
        expect(stored.avatar).toBeNull()
      }

      it.each([
        ['PNG bytes declared as JPEG', PNG_BYTES, 'image/jpeg'],
        ['JPEG bytes declared as PNG', fakeImage(JPEG_HEADER), 'image/png'],
        ['HTML declared as PNG', Buffer.from('<html><script>alert(1)</script></html>'), 'image/png'],
        ['a RIFF file that is not WebP', Buffer.from('RIFF\x10\x00\x00\x00WAVEfmt ', 'latin1'), 'image/webp'],
      ])('wrong magic bytes: %s', async (_label, data, contentType) => {
        const user = await createUser()

        const res = await upload(user.id, data, contentType)

        await expectRefused(user.id, res)
        expect(res.body).toEqual({ message: 'The image content does not match its declared type', status: 400 })
      })

      it('oversized: one byte above the limit', async () => {
        const user = await createUser()

        const res = await upload(user.id, fakeImage(JPEG_HEADER, MAX_AVATAR_BYTES + 1), 'image/jpeg')

        await expectRefused(user.id, res)
        expect(res.body).toMatchObject({ status: 400 })
      })

      it('oversized: far above the limit (refused while reading the body)', async () => {
        const user = await createUser()

        const res = await upload(user.id, fakeImage(JPEG_HEADER, 1024 * 1024), 'image/jpeg')

        await expectRefused(user.id, res)
        expect(res.body).toEqual({ message: 'The image is too large', status: 400 })
      })

      it('invalid base64', async () => {
        const user = await createUser()

        const res = await upload(user.id, 'this is *not* base64')

        await expectRefused(user.id, res)
      })

      it('a data: URL instead of bare base64', async () => {
        const user = await createUser()

        const res = await upload(user.id, `data:image/png;base64,${PNG_BASE64}`)

        await expectRefused(user.id, res)
      })

      it('validation: content type outside JPEG, PNG and WebP', async () => {
        const user = await createUser()

        const res = await upload(user.id, '<svg xmlns="http://www.w3.org/2000/svg"/>', 'image/svg+xml')

        await expectRefused(user.id, res)
      })

      it('validation: empty data', async () => {
        const user = await createUser()

        const res = await upload(user.id, '')

        await expectRefused(user.id, res)
      })

      it('validation: missing contentType', async () => {
        const user = await createUser()

        const res = await agent.put('/me/avatar').set(authHeaderFor(user.id)).send({ data: PNG_BASE64 })

        await expectRefused(user.id, res)
      })
    })

    it('a refused upload keeps the current avatar', async () => {
      const user = await createUser()
      const first = await upload(user.id, PNG_BASE64)

      const res = await upload(user.id, PNG_BYTES, 'image/jpeg')

      expect(res.status).toBe(400)
      expect((await agent.get(first.body.avatar)).status).toBe(200)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.avatar).toBe(first.body.avatar)
    })

    it('401 — unauthenticated request, nothing stored', async () => {
      const res = await agent.put('/me/avatar').send({ contentType: 'image/png', data: PNG_BASE64 })

      expect(res.status).toBe(401)
      expect(await prisma.image.count()).toBe(0)
    })
  })

  // ─── removeMyAvatar ─────────────────────────────────────────────────────
  describe('removeMyAvatar — DELETE /me/avatar', () => {
    it('nominal: clears the avatar and deletes the stored image', async () => {
      const user = await createUser()
      const uploaded = await agent
        .put('/me/avatar')
        .set(authHeaderFor(user.id))
        .send({ contentType: 'image/png', data: PNG_BASE64 })

      const res = await agent.delete('/me/avatar').set(authHeaderFor(user.id))

      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: user.id, avatar: null })
      expect((await agent.get(uploaded.body.avatar)).status).toBe(404)
      expect(await prisma.image.count()).toBe(0)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.avatar).toBeNull()
    })

    it('idempotent: 200 when there is no avatar', async () => {
      const user = await createUser()

      const first = await agent.delete('/me/avatar').set(authHeaderFor(user.id))
      const second = await agent.delete('/me/avatar').set(authHeaderFor(user.id))

      expect(first.status).toBe(200)
      expect(second.status).toBe(200)
      expect(second.body).toMatchObject({ id: user.id, avatar: null })
    })

    it("leaves other users' images alone", async () => {
      const user = await createUser()
      const other = await createUser()
      const otherUpload = await agent
        .put('/me/avatar')
        .set(authHeaderFor(other.id))
        .send({ contentType: 'image/png', data: PNG_BASE64 })

      await agent.delete('/me/avatar').set(authHeaderFor(user.id))

      expect((await agent.get(otherUpload.body.avatar)).status).toBe(200)
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.delete('/me/avatar')

      expect(res.status).toBe(401)
    })
  })

  // ─── changeMyPassword ───────────────────────────────────────────────────
  describe('changeMyPassword — PUT /me/password', () => {
    const NEW_PASSWORD = 'NewPassword123'

    it('nominal: returns a fresh token, and only the new password logs in', async () => {
      const user = await createUser()

      const res = await agent
        .put('/me/password')
        .set(authHeaderFor(user.id))
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(200)
      expect(res.body).toEqual({ userId: user.id, email: user.email, isAdmin: false, token: expect.any(String) })

      const withNew = await agent.post('/login').send({ email: user.email, password: NEW_PASSWORD })
      expect(withNew.status).toBe(200)
      const withOld = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })
      expect(withOld.status).toBe(401)
    })

    it('règle métier: revokes the tokens issued before the change, the returned one stays valid', async () => {
      const user = await createUser()
      const oldHeader = olderAuthHeaderFor(user.id)
      expect((await agent.get('/me').set(oldHeader)).status).toBe(200)

      const res = await agent
        .put('/me/password')
        .set(oldHeader)
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(200)
      expect((await agent.get('/me').set(oldHeader)).status).toBe(401)
      const fresh = await agent.get('/me').set({ Authorization: `Bearer ${res.body.token}` })
      expect(fresh.status).toBe(200)
      expect(fresh.body.id).toBe(user.id)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.tokensValidAfter).not.toBeNull()
    })

    it('règle métier: clears the failed login counter, a temporary lock and a pending reset link', async () => {
      const user = await createUser()
      const header = authHeaderFor(user.id)
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 3, resetToken: 'pending-reset', resetTokenExpiry: new Date(Date.now() + 3_600_000) },
      })

      const res = await agent
        .put('/me/password')
        .set(header)
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(200)
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored).toMatchObject({ loginAttempts: 0, lockedUntil: null, resetToken: null, resetTokenExpiry: null })
      const reset = await agent.post('/reset-password').send({ token: 'pending-reset', newPassword: 'Hijacked123' })
      expect(reset.status).toBe(400)
    })

    it('keeps the admin right in the fresh token payload', async () => {
      const admin = await createAdmin()

      const res = await agent
        .put('/me/password')
        .set(authHeaderFor(admin.id, true))
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(200)
      expect(res.body.isAdmin).toBe(true)
    })

    it('400 (not 401) — wrong current password, nothing changes and the session survives', async () => {
      const user = await createUser()
      const header = olderAuthHeaderFor(user.id)
      const before = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

      const res = await agent
        .put('/me/password')
        .set(header)
        .send({ currentPassword: 'Wrong@1234', newPassword: NEW_PASSWORD })

      expect(res.status).toBe(400)
      expect(res.body).toMatchObject({ status: 400, message: expect.any(String) })
      expect(res.body).not.toHaveProperty('token')
      const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(after.password).toBe(before.password)
      expect(after.tokensValidAfter).toBeNull()
      expect(after.loginAttempts).toBe(1)
      expect(after.lockedUntil).toBeNull()
      expect((await agent.get('/me').set(header)).status).toBe(200)
    })

    it('règle métier: the 5th wrong current password locks the account and signs every session out', async () => {
      const user = await createUser()
      const header = olderAuthHeaderFor(user.id)
      const otherDevice = olderAuthHeaderFor(user.id)
      const attempt = () =>
        agent.put('/me/password').set(header).send({ currentPassword: 'Wrong@1234', newPassword: NEW_PASSWORD })

      for (let i = 0; i < 4; i += 1) {
        expect((await attempt()).status).toBe(400)
      }
      expect((await agent.get('/me').set(header)).status).toBe(200)

      const locking = await attempt()

      expect(locking.status).toBe(401)
      expect(locking.body).not.toHaveProperty('token')
      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(stored.password).toBe(user.password)
      expect(stored.lockedUntil!.getTime()).toBeGreaterThan(Date.now())
      // Every session is gone, not only the guessing one
      expect((await agent.get('/me').set(header)).status).toBe(401)
      expect((await agent.get('/me').set(otherDevice)).status).toBe(401)
      // …and the right password does not sign in while the lock lasts
      const login = await agent.post('/login').send({ email: user.email, password: FIXTURE_PASSWORD })
      expect(login.status).toBe(403)
    })

    it('règle métier: a successful change restarts the count of wrong current passwords', async () => {
      const user = await createUser()
      const header = olderAuthHeaderFor(user.id)
      for (let i = 0; i < 4; i += 1) {
        await agent.put('/me/password').set(header).send({ currentPassword: 'Wrong@1234', newPassword: NEW_PASSWORD })
      }

      const res = await agent
        .put('/me/password')
        .set(header)
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(200)
      expect((await prisma.user.findUniqueOrThrow({ where: { id: user.id } })).loginAttempts).toBe(0)
    })

    it.each([
      ['shorter than 8 characters (validation)', 'Abc1'],
      ['without a digit', 'NewPassword'],
      ['without an uppercase letter', 'newpassword123'],
    ])('400 — weak new password: %s', async (_label, newPassword) => {
      const user = await createUser()
      const before = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })

      const res = await agent
        .put('/me/password')
        .set(authHeaderFor(user.id))
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword })

      expect(res.status).toBe(400)
      const after = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(after.password).toBe(before.password)
      expect(after.tokensValidAfter).toBeNull()
    })

    it('400 — validation: missing currentPassword', async () => {
      const user = await createUser()

      const res = await agent.put('/me/password').set(authHeaderFor(user.id)).send({ newPassword: NEW_PASSWORD })

      expect(res.status).toBe(400)
    })

    it('never returns the password hash', async () => {
      const user = await createUser()

      const res = await agent
        .put('/me/password')
        .set(authHeaderFor(user.id))
        .send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } })
      expect(JSON.stringify(res.body)).not.toContain(stored.password)
      expect(res.body).not.toHaveProperty('password')
    })

    it('401 — unauthenticated request', async () => {
      const res = await agent.put('/me/password').send({ currentPassword: FIXTURE_PASSWORD, newPassword: NEW_PASSWORD })

      expect(res.status).toBe(401)
    })
  })
})
