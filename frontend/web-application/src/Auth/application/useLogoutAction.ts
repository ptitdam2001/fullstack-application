import { useCallback } from 'react'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'
import { clearAuthStorage } from '../infrastructure/authStorage'
import { AuthProvider } from './AuthProvider'

export const useLogoutAction = () => {
  const { token } = AuthProvider.useAuthValue()
  const dispatch = AuthProvider.useAuthDispatch()

  return useCallback(() => {
    if (!token) {
      return Promise.reject()
    }

    clearAuthStorage()
    dispatch(DEFAULT_AUTH_DATA)
    return Promise.resolve()
  }, [dispatch, token])
}
