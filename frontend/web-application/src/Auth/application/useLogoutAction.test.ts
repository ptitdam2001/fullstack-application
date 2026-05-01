import { vi } from 'vitest'
import { act } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'

const mockDispatch = vi.fn()

vi.mock('@Common/hooks/useLocalstorage', () => ({
  useLocalStorage: vi.fn(),
}))

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(() => ({ user: undefined, token: undefined })),
    useAuthDispatch: vi.fn(() => mockDispatch),
  },
}))

import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { useLogoutAction } from './useLogoutAction'

const mockSetUser = vi.fn()

describe('useLogoutAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects when no token', async () => {
    vi.mocked(useLocalStorage).mockReturnValue([{ token: undefined, user: undefined }, mockSetUser])

    const { result } = renderHookWithProviders(() => useLogoutAction())

    await expect(act(() => result.current())).rejects.toBeUndefined()
    expect(mockSetUser).not.toHaveBeenCalled()
  })

  it('resolves and clears user when token present', async () => {
    vi.mocked(useLocalStorage).mockReturnValue([{ token: 'abc', user: { id: '1' } }, mockSetUser])

    const { result } = renderHookWithProviders(() => useLogoutAction())

    await act(() => result.current())

    expect(mockSetUser).toHaveBeenCalledWith({ user: undefined, token: undefined })
  })
})
