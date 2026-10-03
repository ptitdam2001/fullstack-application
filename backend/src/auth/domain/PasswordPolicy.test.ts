import { describe, expect, it } from 'vitest'
import { isPasswordValid } from './PasswordPolicy.js'

describe('isPasswordValid (spec 10)', () => {
  it('accepts 8 characters with a digit and an uppercase letter', () => {
    expect(isPasswordValid('Abcdefg1')).toBe(true)
  })

  it('accepts an accented uppercase letter', () => {
    expect(isPasswordValid('Écureuil1')).toBe(true)
  })

  it.each([
    ['shorter than 8 characters', 'Abcde1'],
    ['without a digit', 'Abcdefgh'],
    ['without an uppercase letter', 'abcdefg1'],
    ['empty', ''],
  ])('refuses a password %s', (_label, password) => {
    expect(isPasswordValid(password)).toBe(false)
  })
})
