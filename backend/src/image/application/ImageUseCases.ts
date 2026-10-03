import type { IImageStorage } from '../ports/IImageStorage.js'
import type { ImageContent } from '../domain/Image.js'
import { ImageNotFoundError } from '../domain/ImageErrors.js'

export class ImageUseCases {
  constructor(private readonly storage: IImageStorage) {}

  async getById(id: string): Promise<ImageContent> {
    const image = await this.storage.findById(id)
    if (!image) {
      throw new ImageNotFoundError()
    }
    return image
  }
}
