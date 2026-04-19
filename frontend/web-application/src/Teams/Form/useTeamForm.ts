import { CreateTeamMutationBody, UpdateTeamMutationBody, useCreateTeam, useUpdateTeam } from '@Sdk/team/team'
import { getCountTeamsQueryKey, getGetTeamsQueryKey } from '@Sdk/teams/teams'

export const useTeamForm = () => {
  const createTeamMutation = useCreateTeam({
    mutation: {
      meta: {
        invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()],
      },
    },
  })
  const updateTeamMutation = useUpdateTeam({
    mutation: {
      meta: {
        invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()],
      },
    },
  })

  return {
    submit: (data: CreateTeamMutationBody | UpdateTeamMutationBody, teamId?: string) =>
      teamId
        ? updateTeamMutation.mutateAsync({ id: teamId, data: { ...(data as UpdateTeamMutationBody), id: teamId } })
        : createTeamMutation.mutateAsync({ data: data as CreateTeamMutationBody }),
    isPending: createTeamMutation.isPending || updateTeamMutation.isPending,
    isSuccess: createTeamMutation.isSuccess || updateTeamMutation.isSuccess,
  }
}
