import { AuthProvider } from './AuthProvider'
import { UserCard as CommonUserCard } from '@Common/UserCard'

export const UserCard = () => {
  const { user } = AuthProvider.useAuthValue()

  return <CommonUserCard user={{ login: user?.email ?? '' }} />
}
