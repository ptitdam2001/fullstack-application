import type { ImageContentType } from '../../image/domain/Image.js'

/**
 * Largest profile picture accepted, once decoded. The client resizes to 256 px before sending,
 * which lands far below this.
 */
export const MAX_AVATAR_BYTES = 100 * 1024

/** Length of the base64 text carrying `MAX_AVATAR_BYTES` (4 characters for every 3 bytes, padded). */
export const MAX_AVATAR_BASE64_LENGTH = Math.ceil(MAX_AVATAR_BYTES / 3) * 4

/** Body of PUT /me/avatar. */
export type UploadAvatarInput = {
  contentType: ImageContentType
  /** Base64, without a `data:` prefix. */
  data: string
}
