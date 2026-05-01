import { vi } from 'vitest'
import { renderHookWithProviders } from '../../../tests/test-utils'

vi.mock('@Common/hooks/useLocalstorage', () => ({
  useLocalStorage: vi.fn(),
}))

import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { useCheckAuth } from './useCheckAuth'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

describe('useCheckAuth', () => {
  it('returns default auth data when storage is empty', () => {
    vi.mocked(useLocalStorage).mockReturnValue([DEFAULT_AUTH_DATA, vi.fn()])

    const { result } = renderHookWithProviders(() => useCheckAuth())

    expect(result.current).toEqual(DEFAULT_AUTH_DATA)
  })

  it('returns stored auth data when present', () => {
    const stored = {
      user: { id: '1', email: 'a@b.com', firstname: 'A', lastname: 'B' },
      token: 'tok',
    }
    vi.mocked(useLocalStorage).mockReturnValue([stored, vi.fn()])

    const { result } = renderHookWithProviders(() => useCheckAuth())

    expect(result.current).toEqual(stored)
  })
})
