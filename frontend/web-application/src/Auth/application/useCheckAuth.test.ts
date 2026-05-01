import { vi } from 'vitest'
import { renderHookWithProviders } from '../../../tests/test-utils'

const { mockReadAuthStorage } = vi.hoisted(() => ({
  mockReadAuthStorage: vi.fn(),
}))

vi.mock('../infrastructure/authStorage', () => ({
  readAuthStorage: mockReadAuthStorage,
}))

import { useCheckAuth } from './useCheckAuth'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

describe('useCheckAuth', () => {
  it('returns default auth data when storage is empty', () => {
    mockReadAuthStorage.mockReturnValue(DEFAULT_AUTH_DATA)

    const { result } = renderHookWithProviders(() => useCheckAuth())

    expect(result.current).toEqual(DEFAULT_AUTH_DATA)
  })

  it('returns stored auth data when present', () => {
    const stored = { user: { id: '1', email: 'a@b.com', firstname: 'A', lastname: 'B' }, token: 'tok' }
    mockReadAuthStorage.mockReturnValue(stored)

    const { result } = renderHookWithProviders(() => useCheckAuth())

    expect(result.current).toEqual(stored)
  })
})
