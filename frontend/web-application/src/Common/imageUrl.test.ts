import { describe, expect, it } from 'vitest'
import { resolveImageUrl } from './imageUrl'

const BASE = 'http://api.local:4000/'

describe('resolveImageUrl', () => {
  it.each([undefined, null, '', '   '])('returns undefined for an empty value (%j)', value => {
    expect(resolveImageUrl(value, BASE)).toBeUndefined()
  })

  it('prefixes a relative API url with the base url', () => {
    expect(resolveImageUrl('/images/abc123', BASE)).toBe('http://api.local:4000/images/abc123')
  })

  it('joins with exactly one slash whatever the base url and path look like', () => {
    expect(resolveImageUrl('images/abc123', 'http://api.local:4000')).toBe('http://api.local:4000/images/abc123')
    expect(resolveImageUrl('/images/abc123', 'http://api.local:4000')).toBe('http://api.local:4000/images/abc123')
    expect(resolveImageUrl('images/abc123', BASE)).toBe('http://api.local:4000/images/abc123')
  })

  it('keeps a base url path prefix', () => {
    expect(resolveImageUrl('/images/abc123', 'https://example.org/api/')).toBe('https://example.org/api/images/abc123')
  })

  it.each([
    'http://cdn.example.org/a.png',
    'https://cdn.example.org/a.png',
    'HTTPS://cdn.example.org/a.png',
    '//cdn.example.org/a.png',
    'data:image/jpeg;base64,/9j/4AAQ',
    'blob:http://localhost:5173/3f1c',
  ])('returns an absolute url untouched (%s)', value => {
    expect(resolveImageUrl(value, BASE)).toBe(value)
  })

  it('falls back to the axios base url when none is given', () => {
    expect(resolveImageUrl('/images/abc123')).toMatch(/^https?:\/\/.+\/images\/abc123$/)
  })
})
