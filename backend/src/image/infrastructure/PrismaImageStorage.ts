import { randomBytes } from 'node:crypto'
import { prisma } from '../../../utils/prismaClient.js'
import type { IImageStorage } from '../ports/IImageStorage.js'
import type { ImageContent, SavedImage, SaveImageInput } from '../domain/Image.js'

// The id handed out by this storage is a random 128-bit token (base64url), not the MongoDB ObjectId.
// GET /images/{id} is public: an ObjectId embeds a date and a counter, so one known URL would let anyone
// walk through the pictures of every user. A random token cannot be guessed from another one.
const PUBLIC_ID_BYTES = 16
const PUBLIC_ID = /^[A-Za-z0-9_-]{22}$/

const newPublicId = (): string => randomBytes(PUBLIC_ID_BYTES).toString('base64url')

/** Relative on purpose — see IImageStorage. Served by `GET /images/{id}` (ImageHttpHandlers). */
const toUrl = (id: string): string => `/images/${id}`
/** The reverse of `toUrl`. */
const IMAGE_URL = /^\/images\/([A-Za-z0-9_-]{22})$/

/** Images stored in the `images` MongoDB collection. */
export class PrismaImageStorage implements IImageStorage {
  async save({ data, contentType, ownerId }: SaveImageInput): Promise<SavedImage> {
    const { publicId } = await prisma.image.create({
      data: { publicId: newPublicId(), data: new Uint8Array(data), contentType, size: data.byteLength, ownerId },
      select: { publicId: true },
    })
    return { id: publicId, url: toUrl(publicId) }
  }

  async findById(id: string): Promise<ImageContent | null> {
    // An id this storage never issued is simply "not found" — the database is not even asked.
    if (!PUBLIC_ID.test(id)) {
      return null
    }
    return prisma.image.findUnique({ where: { publicId: id }, select: { data: true, contentType: true } })
  }

  async delete(id: string): Promise<void> {
    if (!PUBLIC_ID.test(id)) {
      return
    }
    await prisma.image.deleteMany({ where: { publicId: id } })
  }

  async deleteByOwner(ownerId: string): Promise<void> {
    await prisma.image.deleteMany({ where: { ownerId } })
  }

  async deleteByOwnerAndUrl(ownerId: string, url: string): Promise<void> {
    const publicId = IMAGE_URL.exec(url)?.[1]
    if (publicId === undefined) {
      return
    }
    await prisma.image.deleteMany({ where: { ownerId, publicId } })
  }
}
