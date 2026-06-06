import { vi } from 'vitest'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useLogoutAction } from './useLogoutAction'
import { clearAuthStorage } from '../infrastructure/authStorage'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

const mockDispatch = vi.fn()

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn().mockReturnValue({}),
    useAuthDispatch: () => mockDispatch,
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}))

vi.mock('../infrastructure/authStorage', () => ({
  clearAuthStorage: vi.fn(),
  readAuthStorage: vi.fn().mockReturnValue({}),
  saveAuthStorage: vi.fn(),
}))

describe('useLogoutAction', () => {
  it('clears storage and dispatches DEFAULT_AUTH_DATA', () => {
    const { result } = renderHookWithProviders(() => useLogoutAction())
    result.current()
    expect(clearAuthStorage).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(DEFAULT_AUTH_DATA)
  })
})
