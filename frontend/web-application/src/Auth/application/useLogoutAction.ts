import { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { clearAuthStorage } from '../infrastructure/authStorage'
import { AuthProvider } from './AuthProvider'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

export const useLogoutAction = () => {
  const dispatch = AuthProvider.useAuthDispatch()
  const queryClient = useQueryClient()

  // Stable: Logout runs it from an effect
  return useCallback(() => {
    clearAuthStorage()
    dispatch(DEFAULT_AUTH_DATA)
    // No page reload on sign-out: drop the cached data, it belongs to the user who just left
    queryClient.clear()
  }, [dispatch, queryClient])
}
