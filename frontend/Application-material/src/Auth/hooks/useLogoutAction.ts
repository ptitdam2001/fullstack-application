import { useCallback } from 'react'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { AuthProvider, DEFAULT_AUTH_DATA } from '@Auth/AuthProvider'

export const useLogoutAction = () => {
  const [user, setUser] = useLocalStorage('user', DEFAULT_AUTH_DATA)
  const dispatch = AuthProvider.useAuthDispatch()

  return useCallback(() => {
    if (!user.token) {
      return Promise.reject()
    }

    setUser(DEFAULT_AUTH_DATA)
    dispatch(DEFAULT_AUTH_DATA)
    return Promise.resolve()
  }, [dispatch, setUser, user.token])
}
