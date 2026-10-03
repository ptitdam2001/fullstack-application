export const IMAGE_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type ImageContentType = (typeof IMAGE_CONTENT_TYPES)[number]

/** What is needed to serve an image back. */
export type ImageContent = {
  data: Uint8Array
  contentType: string
}

export type SaveImageInput = {
  data: Uint8Array
  contentType: ImageContentType
  ownerId: string
}

export type SavedImage = {
  id: string
  url: string
}
