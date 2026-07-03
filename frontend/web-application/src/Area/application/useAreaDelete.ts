import { useDeleteArea, getGetAreaListQueryKey, getCountAllAreasQueryKey } from '../infrastructure/useAreaApi'

const invalidates = [getGetAreaListQueryKey(), getCountAllAreasQueryKey()]

export const useAreaDelete = () => {
  const { mutateAsync, isPending } = useDeleteArea({
    mutation: { meta: { invalidates } },
  })

  return {
    deleteArea: (id: string) => mutateAsync({ id }),
    isPending,
  }
}
