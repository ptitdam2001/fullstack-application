import { describe, expect, it } from 'vitest'
import { getEmailErrorKey } from './emailError'

describe('getEmailErrorKey', () => {
  it.each([undefined, null, '', '   '])('returns the required key for an empty value (%j)', value => {
    expect(getEmailErrorKey(value, 'auth')).toBe('auth.error.required')
  })

  it.each(['abc', 'abc@', 'jane@doe'])('returns the invalid email key for %j', value => {
    expect(getEmailErrorKey(value, 'auth')).toBe('auth.error.invalidEmail')
  })

  it('uses the namespace of the form', () => {
    expect(getEmailErrorKey('', 'register')).toBe('register.error.required')
    expect(getEmailErrorKey('abc', 'register')).toBe('register.error.invalidEmail')
  })
})
