import { useGetTeam } from '@Sdk/team/team'

export const TeamBreadcrumb = ({ teamId }: { teamId: string }) => {
  const { data: team } = useGetTeam(teamId, { query: { enabled: !!teamId } })
  return <>{team?.name ?? teamId}</>
}
