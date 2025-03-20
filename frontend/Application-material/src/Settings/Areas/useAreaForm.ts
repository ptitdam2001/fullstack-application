import { CreateAreaMutationBody, UpdateAreaMutationBody, useCreateArea, useUpdateArea } from "@Sdk/area/area"

export const useAreaForm = () => {
  const { mutateAsync: createFunc, isPending: isPendingCreate, isSuccess: isSuccessCreate } = useCreateArea()
  const { mutateAsync: updateFunc, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = useUpdateArea()

  return {
    submit: (data: CreateAreaMutationBody|UpdateAreaMutationBody, areaId?: string) =>
      areaId ? updateFunc({ id: areaId, data }) : createFunc({ data }),
    isPending: isPendingCreate || isPendingUpdate,
    isSuccess: isSuccessCreate || isSuccessUpdate,
  }
}
