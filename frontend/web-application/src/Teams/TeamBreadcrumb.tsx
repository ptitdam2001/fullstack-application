import { useGetTeam } from './infrastructure/useTeamApi'

export const TeamBreadcrumb = ({ teamId }: { teamId: string }) => {
  const { data: team } = useGetTeam(teamId, { query: { enabled: !!teamId } })
  return <>{team?.name ?? teamId}</>
}
