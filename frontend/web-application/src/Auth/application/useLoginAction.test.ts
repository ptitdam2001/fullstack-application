import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'
import { server } from '@/mocks/node'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useLoginAction } from './useLoginAction'
import { saveAuthStorage } from '../infrastructure/authStorage'
import { CONNECTED_HOME, ONBOARDING_PAGE } from '../domain/Auth'

const mockDispatch = vi.fn()
const mockNavigate = vi.fn()

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn().mockReturnValue({}),
    useAuthDispatch: () => mockDispatch,
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}))

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../infrastructure/authStorage', () => ({
  saveAuthStorage: vi.fn(),
  readAuthStorage: vi.fn().mockReturnValue({}),
  clearAuthStorage: vi.fn(),
}))

const tokenResponse = { token: 'jwt-token', userId: 'u1', email: 'a@b.com', isAdmin: false }
const meResponse = { id: 'u1', email: 'a@b.com', roles: ['COACH'] }

describe('useLoginAction', () => {
  it('calls saveAuthStorage, dispatch, and navigates to dashboard on success', async () => {
    server.use(
      http.post('*/login', () => HttpResponse.json(tokenResponse)),
      http.get('*/me', () => HttpResponse.json(meResponse))
    )
    const { result } = renderHookWithProviders(() => useLoginAction())
    await result.current.process('a@b.com', 'password')

    await waitFor(() => {
      expect(saveAuthStorage).toHaveBeenCalledWith({ token: 'jwt-token' })
      expect(mockDispatch).toHaveBeenCalledWith({ token: 'jwt-token', user: meResponse })
      expect(mockNavigate).toHaveBeenCalledWith(CONNECTED_HOME)
    })
  })

  it('navigates to onboarding when user has no team role', async () => {
    server.use(
      http.post('*/login', () => HttpResponse.json(tokenResponse)),
      http.get('*/me', () => HttpResponse.json({ ...meResponse, roles: [] }))
    )
    const { result } = renderHookWithProviders(() => useLoginAction())
    await result.current.process('a@b.com', 'password')

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ONBOARDING_PAGE)
    })
  })

  it('throws on 401 (invalid credentials)', async () => {
    server.use(http.post('*/login', () => HttpResponse.json({ message: 'Invalid', status: 401 }, { status: 401 })))
    const { result } = renderHookWithProviders(() => useLoginAction())

    await expect(result.current.process('a@b.com', 'wrong')).rejects.toThrow()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('throws on 403 (account inactive or blocked)', async () => {
    server.use(http.post('*/login', () => HttpResponse.json({ message: 'Compte non activé', status: 403 }, { status: 403 })))
    const { result } = renderHookWithProviders(() => useLoginAction())

    await expect(result.current.process('a@b.com', 'password')).rejects.toThrow()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})