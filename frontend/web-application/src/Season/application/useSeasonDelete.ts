import { useRemoveSeason, getGetSeasonsQueryKey, getCountSeasonsQueryKey } from '../infrastructure/useSeasonApi'

export const useSeasonDelete = () => {
  const deleteMutation = useRemoveSeason({
    mutation: {
      meta: { invalidates: [getGetSeasonsQueryKey(), getCountSeasonsQueryKey()] },
    },
  })

  return {
    deleteSeason: (id: string) => deleteMutation.mutateAsync({ id }),
    isPending: deleteMutation.isPending,
  }
}
