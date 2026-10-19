import { describe, expect, it } from 'vitest'
import { getHttpStatus } from './httpError'

describe('getHttpStatus', () => {
  it('returns the status of an HTTP error response', () => {
    expect(getHttpStatus({ response: { status: 409 } })).toBe(409)
  })

  it.each([
    ['a network error without response', new Error('Network Error')],
    ['a response without status', { response: {} }],
    ['undefined', undefined],
    ['null', null],
  ])('returns undefined for %s', (_label, err) => {
    expect(getHttpStatus(err)).toBeUndefined()
  })
})
