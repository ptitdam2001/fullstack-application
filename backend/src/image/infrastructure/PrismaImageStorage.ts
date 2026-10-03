import { prisma } from '../../../utils/prismaClient.js'
import type { IImageStorage } from '../ports/IImageStorage.js'
import type { ImageContent, SavedImage, SaveImageInput } from '../domain/Image.js'

const OBJECT_ID = /^[0-9a-f]{24}$/i

/** Relative on purpose — see IImageStorage. Served by `GET /images/{id}` (ImageHttpHandlers). */
const toUrl = (id: string): string => `/images/${id}`

/** Images stored in the `images` MongoDB collection. */
export class PrismaImageStorage implements IImageStorage {
  async save({ data, contentType, ownerId }: SaveImageInput): Promise<SavedImage> {
    const { id } = await prisma.image.create({
      data: { data: new Uint8Array(data), contentType, size: data.byteLength, ownerId },
      select: { id: true },
    })
    return { id, url: toUrl(id) }
  }

  async findById(id: string): Promise<ImageContent | null> {
    // Prisma throws on a malformed ObjectId: an id this storage never issued is simply "not found".
    if (!OBJECT_ID.test(id)) {
      return null
    }
    return prisma.image.findUnique({ where: { id }, select: { data: true, contentType: true } })
  }

  async delete(id: string): Promise<void> {
    if (!OBJECT_ID.test(id)) {
      return
    }
    await prisma.image.deleteMany({ where: { id } })
  }

  async deleteByOwner(ownerId: string, options: { exceptId?: string } = {}): Promise<void> {
    await prisma.image.deleteMany({
      where: { ownerId, ...(options.exceptId !== undefined && { id: { not: options.exceptId } }) },
    })
  }
}
