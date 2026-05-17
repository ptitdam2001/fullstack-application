import { AuthProvider } from '../../application/AuthProvider'

export const AuthActions = () => {
  const { user, token } = AuthProvider.useAuthValue()
  if (!user || !token) {
    return null
  }
  return null
}
