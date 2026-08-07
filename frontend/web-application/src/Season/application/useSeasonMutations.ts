import type { SeasonInput } from '../domain/Season'
import {
  useCreateSeason,
  useUpdateSeason,
  getGetSeasonsQueryKey,
  getCountSeasonsQueryKey,
} from '../infrastructure/useSeasonApi'

const invalidates = [getGetSeasonsQueryKey(), getCountSeasonsQueryKey()]

export const useSeasonMutations = () => {
  const { mutateAsync: createFunc, isPending: isPendingCreate } = useCreateSeason({
    mutation: { meta: { invalidates } },
  })
  const { mutateAsync: updateFunc, isPending: isPendingUpdate } = useUpdateSeason({
    mutation: { meta: { invalidates } },
  })

  return {
    submit: (data: SeasonInput, id?: string) => (id ? updateFunc({ id, data }) : createFunc({ data })),
    isPending: isPendingCreate || isPendingUpdate,
  }
}
