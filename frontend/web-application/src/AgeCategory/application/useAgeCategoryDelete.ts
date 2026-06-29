import {
  useRemoveAgeCategory,
  getGetAgeCategoriesQueryKey,
  getCountAgeCategoriesQueryKey,
} from '../infrastructure/useAgeCategoryApi'

export const useAgeCategoryDelete = () => {
  const deleteMutation = useRemoveAgeCategory({
    mutation: {
      meta: { invalidates: [getGetAgeCategoriesQueryKey(), getCountAgeCategoriesQueryKey()] },
    },
  })

  return {
    deleteAgeCategory: (id: string) => deleteMutation.mutateAsync({ id }),
    isPending: deleteMutation.isPending,
  }
}
