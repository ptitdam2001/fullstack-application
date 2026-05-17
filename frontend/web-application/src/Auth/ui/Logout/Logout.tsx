import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { clearAuthStorage } from '../../infrastructure/authStorage'
import { AuthProvider } from '../../application/AuthProvider'
import { DEFAULT_AUTH_DATA, LOGIN_PAGE } from '../../domain/Auth'

export const Logout = () => {
  const dispatch = AuthProvider.useAuthDispatch()

  useEffect(() => {
    clearAuthStorage()
    dispatch(DEFAULT_AUTH_DATA)
  }, [dispatch])

  return <Navigate to={LOGIN_PAGE} replace />
}
