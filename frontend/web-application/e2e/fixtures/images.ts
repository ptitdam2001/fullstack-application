import { crc32, deflateSync } from 'node:zlib'

/** Payload accepted by Playwright's `setInputFiles`. */
export type FilePayload = { name: string; mimeType: string; buffer: Buffer }

type Rgba = [red: number, green: number, blue: number, alpha: number]

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

const pngChunk = (type: string, data: Buffer): Buffer => {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const typed = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const checksum = Buffer.alloc(4)
  checksum.writeUInt32BE(crc32(typed) >>> 0)
  return Buffer.concat([length, typed, checksum])
}

/**
 * Builds a real, decodable RGBA PNG without any dependency. `pixel` is called for every pixel,
 * so a test can produce a flat color, a gradient (non-compressible → large file) or transparency.
 */
export const createPng = (width: number, height: number, pixel: (x: number, y: number) => Rgba): Buffer => {
  const stride = width * 4 + 1
  const raw = Buffer.alloc(stride * height)
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0 // filter type: none
    for (let x = 0; x < width; x++) {
      const offset = y * stride + 1 + x * 4
      const [red, green, blue, alpha] = pixel(x, y)
      raw[offset] = red
      raw[offset + 1] = green
      raw[offset + 2] = blue
      raw[offset + 3] = alpha
    }
  }

  const header = Buffer.alloc(13)
  header.writeUInt32BE(width, 0)
  header.writeUInt32BE(height, 4)
  header[8] = 8 // bit depth
  header[9] = 6 // color type: RGBA
  header[10] = 0
  header[11] = 0
  header[12] = 0

  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

const flat = (color: Rgba) => (): Rgba => color

/** A small, valid, non-square PNG — the nominal "user picks a photo" file. */
export const validPhoto = (name = 'photo.png', color: Rgba = [30, 120, 200, 255]): FilePayload => ({
  name,
  mimeType: 'image/png',
  buffer: createPng(48, 32, flat(color)),
})

/** A text file: refused by the page before any request is sent. */
export const textFile = (): FilePayload => ({
  name: 'notes.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from('this is not a picture'),
})

/** Announced as a PNG but not decodable: the browser cannot read it. */
export const corruptPhoto = (): FilePayload => ({
  name: 'corrupt.png',
  mimeType: 'image/png',
  buffer: Buffer.from('this is not a picture either'),
})

export const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff, 0xe0])
export { PNG_SIGNATURE }
