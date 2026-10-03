import { describe, expect, it } from 'vitest'
import { matchesImageSignature } from './imageSignature.js'
import type { ImageContentType } from './Image.js'

const JPEG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00])
const PNG = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00])
const WEBP = Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50, 0x56])

describe('matchesImageSignature', () => {
  it.each<[ImageContentType, Uint8Array]>([
    ['image/jpeg', JPEG],
    ['image/png', PNG],
    ['image/webp', WEBP],
  ])('accepts %s bytes declared as such', (contentType, data) => {
    expect(matchesImageSignature(data, contentType)).toBe(true)
  })

  it.each<[ImageContentType, Uint8Array]>([
    ['image/jpeg', PNG],
    ['image/png', JPEG],
    ['image/webp', PNG],
    ['image/png', WEBP],
  ])('refuses bytes that are not %s', (contentType, data) => {
    expect(matchesImageSignature(data, contentType)).toBe(false)
  })

  it('refuses a RIFF container that is not WebP (e.g. WAV)', () => {
    const wav = Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0x10, 0x00, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45])
    expect(matchesImageSignature(wav, 'image/webp')).toBe(false)
  })

  it('refuses data shorter than the signature', () => {
    expect(matchesImageSignature(Uint8Array.from([0xff, 0xd8]), 'image/jpeg')).toBe(false)
    expect(matchesImageSignature(WEBP.subarray(0, 10), 'image/webp')).toBe(false)
    expect(matchesImageSignature(new Uint8Array(0), 'image/png')).toBe(false)
  })

  it('refuses a content type outside the allowed list', () => {
    expect(matchesImageSignature(JPEG, 'image/gif' as ImageContentType)).toBe(false)
  })
})
