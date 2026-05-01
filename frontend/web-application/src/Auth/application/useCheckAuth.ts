import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { DEFAULT_AUTH_DATA } from '../domain/Auth'

export const useCheckAuth = () => {
  const [user] = useLocalStorage('user', DEFAULT_AUTH_DATA)
  return user
}
