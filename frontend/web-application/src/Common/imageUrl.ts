import { getBaseUrl } from '@Config/axios-instance'

// `http:`, `https:`, `data:`, `blob:` … or a protocol-relative `//host/path`
const ABSOLUTE_URL = /^([a-z][a-z\d+.-]*:|\/\/)/i

/**
 * Resolves an image URL returned by the API (e.g. `user.avatar`).
 * The API stores relative URLs (`/images/{id}`) that must be prefixed with the API base URL,
 * while legacy or externally hosted pictures are already absolute and are returned untouched.
 */
export const resolveImageUrl = (url: string | null | undefined, baseUrl: string = getBaseUrl()): string | undefined => {
  const trimmed = url?.trim()
  if (!trimmed) {
    return undefined
  }
  if (ABSOLUTE_URL.test(trimmed)) {
    return trimmed
  }
  return `${baseUrl.replace(/\/+$/, '')}/${trimmed.replace(/^\/+/, '')}`
}
