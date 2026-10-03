import { vi } from 'vitest'
import { renderHookWithProviders } from '../../../tests/test-utils'
import { useAuthSession } from './useAuthSession'
import { readAuthStorage, saveAuthStorage } from '../infrastructure/authStorage'

const mockDispatch = vi.fn()

vi.mock('./AuthProvider', () => ({
  AuthProvider: {
    useAuthValue: vi.fn().mockReturnValue({}),
    useAuthDispatch: () => mockDispatch,
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}))

vi.mock('../infrastructure/authStorage', () => ({
  saveAuthStorage: vi.fn(),
  readAuthStorage: vi.fn(),
  clearAuthStorage: vi.fn(),
}))

const storedUser = {
  id: 'u1',
  email: 'jane@doe.io',
  firstName: 'Jane',
  lastName: 'Doe',
  avatar: '/images/old',
  roles: ['COACH' as const],
}

describe('useAuthSession', () => {
  beforeEach(() => {
    vi.mocked(readAuthStorage).mockReturnValue({ token: 'jwt', user: storedUser })
  })

  describe('updateUser', () => {
    it('writes the updated user to storage (token kept) and to the auth context', () => {
      const { result } = renderHookWithProviders(() => useAuthSession())
      const updated = { ...storedUser, firstName: 'Janet', avatar: '/images/new' }

      result.current.updateUser(updated)

      expect(saveAuthStorage).toHaveBeenCalledWith({ token: 'jwt', user: updated })
      expect(mockDispatch).toHaveBeenCalledWith({ user: updated })
    })

    it('keeps the resolved roles when the response does not carry them', () => {
      const { result } = renderHookWithProviders(() => useAuthSession())

      const user = result.current.updateUser({ id: 'u1', email: 'jane@doe.io', firstName: 'Janet', lastName: 'Doe' })

      expect(user.roles).toEqual(['COACH'])
    })

    it('clears the last name and the avatar when the response omits them or sends null', () => {
      const { result } = renderHookWithProviders(() => useAuthSession())

      const user = result.current.updateUser({ id: 'u1', firstName: 'Jane', lastName: null as unknown as undefined })

      expect(user.lastName).toBeUndefined()
      expect(user.avatar).toBeUndefined()
      expect(mockDispatch).toHaveBeenCalledWith({ user })
    })
  })

  describe('updateToken', () => {
    it('replaces the stored token (user kept) and the context token', () => {
      const { result } = renderHookWithProviders(() => useAuthSession())

      result.current.updateToken('fresh-jwt')

      expect(saveAuthStorage).toHaveBeenCalledWith({ token: 'fresh-jwt', user: storedUser })
      expect(mockDispatch).toHaveBeenCalledWith({ token: 'fresh-jwt' })
    })
  })
})
