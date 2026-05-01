import { UserCard as CommonUserCard } from '@Common/UserCard'
import { AuthProvider } from '../application/AuthProvider'

export const UserCard = () => {
  const { user } = AuthProvider.useAuthValue()

  return <CommonUserCard user={{ login: user?.email ?? '' }} />
}
