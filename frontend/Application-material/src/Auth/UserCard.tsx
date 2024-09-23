import { useAuthContext } from './AuthProvider'
import { UserCard as CommonUserCard } from '@Common/UserCard'

export const UserCard = () => {
  const { user } = useAuthContext()

  return <CommonUserCard user={user} />
}
