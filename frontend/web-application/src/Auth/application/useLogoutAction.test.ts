import { createElement, type ReactNode } from 'react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
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

  // Signing out does not reload the page: without this, the next user of the tab would first see
  // the previous user's cached data
  it('clears the query cache', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['/me'], { id: 'previous-user' })
    const wrapper = ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const { result } = renderHook(() => useLogoutAction(), { wrapper })
    result.current()

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
  })
})
