import { useQueryClient } from '@tanstack/react-query'
import type { UpdateUserInput } from '../domain/User'
import { useUpdateUser, getGetUserQueryKey } from '../infrastructure/useUserApi'
import { userListInvalidates } from './userQueryKeys'

export const useUserUpdate = () => {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useUpdateUser({
    mutation: {
      meta: { invalidates: userListInvalidates },
      // The detail key depends on the id: seed it with the PATCH response instead of refetching
      onSuccess: (user, { id }) => queryClient.setQueryData(getGetUserQueryKey(id), user),
    },
  })

  return {
    updateUser: (id: string, data: UpdateUserInput) => mutateAsync({ id, data }),
    isPending,
  }
}
