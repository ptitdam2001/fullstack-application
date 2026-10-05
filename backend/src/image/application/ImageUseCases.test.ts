import { describe, expect, it, vi } from 'vitest'
import { ImageUseCases } from './ImageUseCases.js'
import type { IImageStorage } from '../ports/IImageStorage.js'
import { ImageNotFoundError } from '../domain/ImageErrors.js'

const image = { data: Uint8Array.from([0xff, 0xd8, 0xff]), contentType: 'image/jpeg' }

const makeStorage = (overrides: Partial<IImageStorage> = {}): IImageStorage => ({
  save: vi.fn(),
  findById: vi.fn().mockResolvedValue(image),
  delete: vi.fn(),
  deleteByOwner: vi.fn(),
  deleteByOwnerAndUrl: vi.fn(),
  ...overrides,
})

describe('ImageUseCases.getById', () => {
  it('returns the stored bytes and content type', async () => {
    const storage = makeStorage()
    expect(await new ImageUseCases(storage).getById('image-1')).toEqual(image)
    expect(storage.findById).toHaveBeenCalledWith('image-1')
  })

  it('throws ImageNotFoundError when the storage has no such image', async () => {
    const storage = makeStorage({ findById: vi.fn().mockResolvedValue(null) })
    await expect(new ImageUseCases(storage).getById('unknown')).rejects.toThrow(ImageNotFoundError)
  })
})
