import { describe, expect, it } from 'vitest'
import { getPasswordStrength, isPasswordCompliant } from './password'

describe('getPasswordStrength', () => {
  it.each([
    ['', 0],
    ['abcdefg', 0],
    ['abcdefgh', 1],
    ['abc1', 1],
    ['Abc', 1],
    ['abcdefg1', 2],
    ['Abcdefgh', 2],
    ['Ab1', 2],
    ['Abcdefg1', 3],
  ] as const)('scores %j as %i', (password, expected) => {
    expect(getPasswordStrength(password)).toBe(expected)
  })
})

describe('isPasswordCompliant', () => {
  it('accepts 8+ characters with a digit and an uppercase letter', () => {
    expect(isPasswordCompliant('Abcdefg1')).toBe(true)
  })

  it.each(['Abcdef1', 'abcdefg1', 'Abcdefgh'])('rejects %j', password => {
    expect(isPasswordCompliant(password)).toBe(false)
  })
})
