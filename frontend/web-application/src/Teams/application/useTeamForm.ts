import { useCreateTeam, useUpdateTeam, getGetTeamsQueryKey, getCountTeamsQueryKey } from '../infrastructure/useTeamApi'
import type { CreateTeamMutationBody, UpdateTeamMutationBody } from '../domain/Team'

export const useTeamForm = () => {
  const createMutation = useCreateTeam({
    mutation: {
      meta: { invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()] },
    },
  })
  const updateMutation = useUpdateTeam({
    mutation: {
      meta: { invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()] },
    },
  })

  return {
    submit: (data: CreateTeamMutationBody | UpdateTeamMutationBody, teamId?: string) =>
      teamId
        ? updateMutation.mutateAsync({ id: teamId, data: { ...(data as UpdateTeamMutationBody), id: teamId } })
        : createMutation.mutateAsync({ data: data as CreateTeamMutationBody }),
    isPending: createMutation.isPending || updateMutation.isPending,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
  }
}
