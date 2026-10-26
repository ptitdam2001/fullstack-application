import { describe, expect, it } from 'vitest'
import { getErrorKey, getHttpStatus } from './httpError'

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

describe('getErrorKey', () => {
  const keys = { 400: 'form.error.invalid', 409: 'form.error.conflict' }

  it('returns the key of the status', () => {
    expect(getErrorKey({ response: { status: 409 } }, keys, 'form.error.generic')).toBe('form.error.conflict')
  })

  it.each([
    ['a status without key', { response: { status: 500 } }],
    ['a network error without response', new Error('Network Error')],
  ])('returns the fallback for %s', (_label, err) => {
    expect(getErrorKey(err, keys, 'form.error.generic')).toBe('form.error.generic')
  })
})
