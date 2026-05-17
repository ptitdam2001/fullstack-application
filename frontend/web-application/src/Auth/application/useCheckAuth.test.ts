import { describe, it, expect, vi } from 'vitest'
import { readAuthStorage } from '../infrastructure/authStorage'
import { useCheckAuth } from './useCheckAuth'

vi.mock('../infrastructure/authStorage', () => ({
  readAuthStorage: vi.fn(),
}))

describe('useCheckAuth', () => {
  it('returns auth data from localStorage', () => {
    const mockData = { token: 'tok', user: { id: 'u1', email: 'a@b.com' } }
    vi.mocked(readAuthStorage).mockReturnValue(mockData as never)
    expect(useCheckAuth()).toEqual(mockData)
  })

  it('returns DEFAULT_AUTH_DATA when localStorage is empty', () => {
    vi.mocked(readAuthStorage).mockReturnValue({ user: undefined, token: undefined })
    expect(useCheckAuth()).toEqual({ user: undefined, token: undefined })
  })
})
