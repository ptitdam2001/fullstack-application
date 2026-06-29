import type { AgeCategoryInput } from '../domain/AgeCategory'
import {
  useCreateAgeCategory,
  useUpdateAgeCategory,
  getGetAgeCategoriesQueryKey,
  getCountAgeCategoriesQueryKey,
} from '../infrastructure/useAgeCategoryApi'

const invalidates = [getGetAgeCategoriesQueryKey(), getCountAgeCategoriesQueryKey()]

export const useAgeCategoryMutations = () => {
  const { mutateAsync: createFunc, isPending: isPendingCreate } = useCreateAgeCategory({
    mutation: { meta: { invalidates } },
  })
  const { mutateAsync: updateFunc, isPending: isPendingUpdate } = useUpdateAgeCategory({
    mutation: { meta: { invalidates } },
  })

  return {
    submit: (data: AgeCategoryInput, id?: string) => (id ? updateFunc({ id, data }) : createFunc({ data })),
    isPending: isPendingCreate || isPendingUpdate,
  }
}
