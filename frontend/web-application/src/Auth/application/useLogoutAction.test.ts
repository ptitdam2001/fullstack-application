import { vi } from 'vitest'
import { act } from '@testing-library/react'
import { renderHookWithProviders } from '../../../tests/test-utils'

const { mockDispatch, mockClearAuthStorage } = vi.hoisted(() => ({
  mockDispatch: vi.fn(),
  mockClearAuthStorage: vi.fn(),
}))

vi.mock('../infrastructure/authStorage', () => ({
  clearAuthStorage: mockClearAuthStorage,
}))

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn(() => ({ user: undefined, token: undefined })),
    useAuthDispatch: vi.fn(() => mockDispatch),
  },
}))

import { AuthProvider } from './AuthProvider'
import { useLogoutAction } from './useLogoutAction'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

describe('useLogoutAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects when no token', async () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({ user: undefined, token: undefined })

    const { result } = renderHookWithProviders(() => useLogoutAction())

    await expect(act(() => result.current())).rejects.toBeUndefined()
    expect(mockClearAuthStorage).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('resolves, clears storage and dispatches when token present', async () => {
    vi.mocked(AuthProvider.useAuthValue).mockReturnValue({
      user: { id: '1', email: 'a@b.com', firstname: 'A', lastname: 'B' },
      token: 'abc',
    })

    const { result } = renderHookWithProviders(() => useLogoutAction())

    await act(() => result.current())

    expect(mockClearAuthStorage).toHaveBeenCalledOnce()
    expect(mockDispatch).toHaveBeenCalledWith(DEFAULT_AUTH_DATA)
  })
})
