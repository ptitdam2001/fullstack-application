import {
  type CreateAreaMutationBody,
  type UpdateAreaMutationBody,
  useCreateArea,
  useUpdateArea,
  getGetAreaListQueryKey,
  getCountAllAreasQueryKey,
} from '../infrastructure/useAreaApi'

const invalidates = [getGetAreaListQueryKey(), getCountAllAreasQueryKey()]

export const useAreaForm = () => {
  const { mutateAsync: createFunc, isPending: isPendingCreate, isSuccess: isSuccessCreate } = useCreateArea({
    mutation: { meta: { invalidates } },
  })
  const { mutateAsync: updateFunc, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = useUpdateArea({
    mutation: { meta: { invalidates } },
  })

  return {
    submit: (data: CreateAreaMutationBody | UpdateAreaMutationBody, areaId?: string) =>
      areaId ? updateFunc({ id: areaId, data }) : createFunc({ data }),
    isPending: isPendingCreate || isPendingUpdate,
    isSuccess: isSuccessCreate || isSuccessUpdate,
  }
}
