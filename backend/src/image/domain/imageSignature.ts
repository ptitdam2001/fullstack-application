import type { ImageContentType } from './Image.js'

const JPEG_SIGNATURE = [0xff, 0xd8, 0xff]
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
// WebP is a RIFF container: "RIFF" <4-byte size> "WEBP"
const RIFF_SIGNATURE = [0x52, 0x49, 0x46, 0x46]
const WEBP_SIGNATURE = [0x57, 0x45, 0x42, 0x50]
const WEBP_SIGNATURE_OFFSET = 8

const startsWith = (data: Uint8Array, signature: number[], offset = 0): boolean =>
  data.length >= offset + signature.length && signature.every((byte, index) => data[offset + index] === byte)

/**
 * True when the leading bytes are the signature of the declared content type. A declared type is only a
 * claim made by the client: this is what stops arbitrary content from being stored and served as an image.
 */
export const matchesImageSignature = (data: Uint8Array, contentType: ImageContentType): boolean => {
  switch (contentType) {
    case 'image/jpeg':
      return startsWith(data, JPEG_SIGNATURE)
    case 'image/png':
      return startsWith(data, PNG_SIGNATURE)
    case 'image/webp':
      return startsWith(data, RIFF_SIGNATURE) && startsWith(data, WEBP_SIGNATURE, WEBP_SIGNATURE_OFFSET)
    default:
      return false
  }
}
