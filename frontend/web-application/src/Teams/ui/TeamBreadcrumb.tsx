import { useTeamBreadcrumb } from '../application/useTeamBreadcrumb'

export const TeamBreadcrumb = ({ teamId }: { teamId: string }) => {
  const { data: team } = useTeamBreadcrumb(teamId)
  return <>{team?.name ?? teamId}</>
}
