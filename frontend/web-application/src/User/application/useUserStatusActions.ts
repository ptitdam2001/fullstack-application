import { useAdminActivateUser, useAdminUnblockUser } from '../infrastructure/useUserApi'
import { userListInvalidates } from './userQueryKeys'

export const useUserStatusActions = () => {
  const activateMutation = useAdminActivateUser({ mutation: { meta: { invalidates: userListInvalidates } } })
  const unblockMutation = useAdminUnblockUser({ mutation: { meta: { invalidates: userListInvalidates } } })

  return {
    activate: (userId: string) => activateMutation.mutateAsync({ userId }),
    unblock: (userId: string) => unblockMutation.mutateAsync({ userId }),
    isPending: activateMutation.isPending || unblockMutation.isPending,
  }
}
