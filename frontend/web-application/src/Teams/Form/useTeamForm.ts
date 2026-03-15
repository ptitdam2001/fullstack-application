import { CreateTeamMutationBody, UpdateTeamMutationBody, useCreateTeam, useUpdateTeam } from '@Sdk/team/team'

export const useTeamForm = () => {
  const { mutateAsync: createFunc, isPending: isPendingCreate, isSuccess: isSuccessCreate } = useCreateTeam()
  const { mutateAsync: updateFunc, isPending: isPendingUpdate, isSuccess: isSuccessUpdate } = useUpdateTeam()

  return {
    submit: (data: CreateTeamMutationBody | UpdateTeamMutationBody, teamId?: string) =>
      teamId ? updateFunc({ id: teamId, data: { ...data as UpdateTeamMutationBody, id: teamId } }) : createFunc({ data: data as CreateTeamMutationBody }),
    isPending: isPendingCreate || isPendingUpdate,
    isSuccess: isSuccessCreate || isSuccessUpdate,
  }
}
