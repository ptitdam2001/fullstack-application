import { AVATAR_SIZE } from '../domain/Account'

const JPEG_MIME = 'image/jpeg'
const JPEG_QUALITY = 0.85

export type SquareCrop = {
  /** Top-left corner of the centered square taken from the source picture */
  sx: number
  sy: number
  /** Side of that source square */
  side: number
  /** Side of the output square — never larger than the source (no upscaling) */
  size: number
}

export const computeSquareCrop = (width: number, height: number, maxSize: number): SquareCrop => {
  const side = Math.min(width, height)
  return {
    sx: Math.floor((width - side) / 2),
    sy: Math.floor((height - side) / 2),
    side,
    size: Math.min(side, maxSize),
  }
}

export const stripDataUrlPrefix = (dataUrl: string): string => dataUrl.slice(dataUrl.indexOf(',') + 1)

type DecodedImage = {
  source: CanvasImageSource
  width: number
  height: number
  release: VoidFunction
}

const decodeWithImageElement = (blob: Blob): Promise<DecodedImage> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const image = new Image()
    image.onload = () =>
      resolve({
        source: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
        release: () => URL.revokeObjectURL(url),
      })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('The picture could not be decoded'))
    }
    image.src = url
  })

const decodeImage = async (blob: Blob): Promise<DecodedImage> => {
  if (typeof createImageBitmap !== 'function') {
    return decodeWithImageElement(blob)
  }
  // 'from-image' applies the EXIF orientation, so phone pictures are not uploaded sideways
  const bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' })
  return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
}

/**
 * Center-crops a picture to a square, scales it down to `maxSize` × `maxSize`, and returns it
 * JPEG-encoded in base64 — WITHOUT the `data:image/jpeg;base64,` prefix, as `PUT /me/avatar` expects.
 * Rejects when the blob is not a decodable picture.
 */
export const resizeImageToJpegBase64 = async (blob: Blob, maxSize: number = AVATAR_SIZE): Promise<string> => {
  const image = await decodeImage(blob)
  try {
    const { sx, sy, side, size } = computeSquareCrop(image.width, image.height, maxSize)
    if (size <= 0) {
      throw new Error('The picture is empty')
    }

    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas 2D is not available')
    }

    // JPEG has no alpha channel: without a backdrop, transparent PNG/WebP pixels turn black
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, size, size)
    context.imageSmoothingQuality = 'high'
    context.drawImage(image.source, sx, sy, side, side, 0, 0, size, size)

    const dataUrl = canvas.toDataURL(JPEG_MIME, JPEG_QUALITY)
    // A browser that cannot encode JPEG silently falls back to PNG
    if (!dataUrl.startsWith(`data:${JPEG_MIME};base64,`)) {
      throw new Error('The picture could not be encoded as JPEG')
    }
    return stripDataUrlPrefix(dataUrl)
  } finally {
    image.release()
  }
}
