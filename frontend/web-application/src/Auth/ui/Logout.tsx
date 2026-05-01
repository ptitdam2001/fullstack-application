import { useEffect } from 'react'
import { Navigate } from 'react-router'
import { LOGIN_PAGE } from '../domain/Auth'
import { useLogoutAction } from '../application/useLogoutAction'

export const Logout = () => {
  const logout = useLogoutAction()

  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to={LOGIN_PAGE} />
}
