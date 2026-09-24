import { useRemoveUser } from '../infrastructure/useUserApi'
import { userListInvalidates } from './userQueryKeys'

export const useUserDelete = () => {
  const { mutateAsync, isPending } = useRemoveUser({ mutation: { meta: { invalidates: userListInvalidates } } })

  return {
    deleteUser: (id: string) => mutateAsync({ id }),
    isPending,
  }
}
