import { CreateTeamMutationBody, UpdateTeamMutationBody, useCreateTeam, useUpdateTeam } from '@Sdk/team/team'
import { getCountTeamsQueryKey, getGetTeamsQueryKey } from '@Sdk/teams/teams'

export const useTeamForm = () => {
  const {
    mutateAsync: createFunc,
    isPending: isPendingCreate,
    isSuccess: isSuccessCreate,
  } = useCreateTeam({
    mutation: {
      meta: {
        invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()],
      },
    },
  })
  const {
    mutateAsync: updateFunc,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
  } = useUpdateTeam({
    mutation: {
      meta: {
        invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()],
      },
    },
  })

  return {
    submit: (data: CreateTeamMutationBody | UpdateTeamMutationBody, teamId?: string) =>
      teamId
        ? updateFunc({ id: teamId, data: { ...(data as UpdateTeamMutationBody), id: teamId } })
        : createFunc({ data: data as CreateTeamMutationBody }),
    isPending: isPendingCreate || isPendingUpdate,
    isSuccess: isSuccessCreate || isSuccessUpdate,
  }
}
