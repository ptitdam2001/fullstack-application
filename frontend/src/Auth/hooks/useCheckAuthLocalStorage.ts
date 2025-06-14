import { DEFAULT_AUTH_DATA } from "@Auth/AuthProvider"
import { useLocalStorage } from "@Common/hooks/useLocalstorage"

export const useCheckAuthLocalStorage = () => {
  const [user] = useLocalStorage('user', DEFAULT_AUTH_DATA)

  return user
}