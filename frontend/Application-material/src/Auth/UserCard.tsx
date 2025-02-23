import { Auth } from './Auth'
import { UserCard as CommonUserCard } from '@Common/UserCard'

export const UserCard = () => {
  const { user } = Auth.useAuthValue()

  return <CommonUserCard user={user} />
}
