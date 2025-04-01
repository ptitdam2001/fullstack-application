import { useEffect } from 'react'
import { Navigate } from 'react-router'
import { LOGIN_PAGE } from './constant'
import { useLogoutAction } from './hooks/useLogoutAction'

export const Logout = () => {
  const logout = useLogoutAction()

  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to={LOGIN_PAGE} />
}
