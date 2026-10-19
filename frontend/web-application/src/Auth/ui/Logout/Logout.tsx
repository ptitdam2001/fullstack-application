import { useEffect } from 'react'
import { Navigate } from 'react-router'
import { useLogoutAction } from '../../application/useLogoutAction'
import { LOGIN_PAGE } from '../../domain/Auth'

export const Logout = () => {
  const logout = useLogoutAction()

  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to={LOGIN_PAGE} replace />
}
