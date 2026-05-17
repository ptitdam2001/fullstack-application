import { clearAuthStorage } from '../infrastructure/authStorage'
import { AuthProvider } from './AuthProvider'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

export const useLogoutAction = () => {
  const dispatch = AuthProvider.useAuthDispatch()

  return () => {
    clearAuthStorage()
    dispatch(DEFAULT_AUTH_DATA)
  }
}
