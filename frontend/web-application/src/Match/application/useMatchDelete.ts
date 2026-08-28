import { useRemoveMatch, getGetMatchesQueryKey, getCountMatchesQueryKey } from '../infrastructure/useMatchApi'

export const useMatchDelete = () => {
  const deleteMutation = useRemoveMatch({
    mutation: {
      meta: { invalidates: [getGetMatchesQueryKey(), getCountMatchesQueryKey()] },
    },
  })

  return {
    deleteMatch: (matchId: string) => deleteMutation.mutateAsync({ id: matchId }),
    isPending: deleteMutation.isPending,
    isSuccess: deleteMutation.isSuccess,
    isError: deleteMutation.isError,
  }
}
