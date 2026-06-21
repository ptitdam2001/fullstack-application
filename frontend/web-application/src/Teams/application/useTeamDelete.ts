import { useRemoveTeam, getGetTeamsQueryKey, getCountTeamsQueryKey } from '../infrastructure/useTeamApi'

export const useTeamDelete = () => {
  const deleteMutation = useRemoveTeam({
    mutation: {
      meta: { invalidates: [getGetTeamsQueryKey(), getCountTeamsQueryKey()] },
    },
  })

  return {
    deleteTeam: (teamId: string) => deleteMutation.mutateAsync({ id: teamId }),
    isPending: deleteMutation.isPending,
    isSuccess: deleteMutation.isSuccess,
    isError: deleteMutation.isError,
  }
}
