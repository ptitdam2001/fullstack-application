import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Logout } from './Logout'

const mockDispatch = vi.fn()

vi.mock('../../application/AuthProvider', () => ({
  AuthProvider: {
    useAuthDispatch: () => mockDispatch,
  },
}))

vi.mock('../../infrastructure/authStorage', () => ({
  clearAuthStorage: vi.fn(),
}))

describe('Logout', () => {
  it('signs out through useLogoutAction: the query cache is cleared too', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['/me'], { id: 'previous-user' })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Logout />
        </MemoryRouter>
      </QueryClientProvider>
    )

    expect(queryClient.getQueryCache().getAll()).toHaveLength(0)
    expect(mockDispatch).toHaveBeenCalledOnce()
  })
})
