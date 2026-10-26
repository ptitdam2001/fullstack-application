import { useCreateTeamJoinRequest, useCreateTeamWithCoach, useDeclareReferee } from '../infrastructure/useAuthApi'

// A team created during onboarding starts black and without area: its coach sets both later
const NEW_TEAM_COLOR = '#000000'

export const useOnboardingActions = () => {
  const refereeMutation = useDeclareReferee()
  const joinMutation = useCreateTeamJoinRequest()
  const createMutation = useCreateTeamWithCoach()

  return {
    declareReferee: () => refereeMutation.mutateAsync(),
    joinTeam: (teamId: string, requestedRole: 'PLAYER' | 'COACH') =>
      joinMutation.mutateAsync({ teamId, data: { requestedRole } }),
    createTeam: (name: string) => createMutation.mutateAsync({ data: { name, color: NEW_TEAM_COLOR, areas: [] } }),
    isRefereePending: refereeMutation.isPending,
    isJoinPending: joinMutation.isPending,
    isCreatePending: createMutation.isPending,
  }
}
