import { describe, expect, it } from 'vitest'
import { getUserInitials, isAcceptedAvatarType } from './Account'

describe('getUserInitials', () => {
  it('uses the first letter of the first and last names, uppercased', () => {
    expect(getUserInitials({ firstName: 'jane', lastName: 'doe' })).toBe('JD')
  })

  it('skips a missing name', () => {
    expect(getUserInitials({ firstName: 'Jane' })).toBe('J')
    expect(getUserInitials({ firstName: 'Jane', lastName: '' })).toBe('J')
  })

  it('returns an empty string without a user', () => {
    expect(getUserInitials(undefined)).toBe('')
  })
})

describe('isAcceptedAvatarType', () => {
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts %s', type => {
    expect(isAcceptedAvatarType(type)).toBe(true)
  })

  it.each(['image/gif', 'image/svg+xml', 'application/pdf', ''])('rejects %j', type => {
    expect(isAcceptedAvatarType(type)).toBe(false)
  })
})
