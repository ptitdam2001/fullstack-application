import { useQueryClient } from '@tanstack/react-query'
import { useRemoveUserAvatar, getGetUserQueryKey } from '../infrastructure/useUserApi'
import { userListInvalidates } from './userQueryKeys'

/** Admin moderation: takes down the photo of a user (DELETE /user/{id}/avatar). */
export const useUserAvatarRemove = () => {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useRemoveUserAvatar({
    mutation: {
      meta: { invalidates: userListInvalidates },
      // Same as useUserUpdate: seed the detail key with the response instead of refetching
      onSuccess: (user, { id }) => queryClient.setQueryData(getGetUserQueryKey(id), user),
    },
  })

  return {
    removeUserAvatar: (id: string) => mutateAsync({ id }),
    isPending,
  }
}
