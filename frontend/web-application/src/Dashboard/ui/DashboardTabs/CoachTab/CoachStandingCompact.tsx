import { useGetTeamCurrentGroup } from '@Sdk/teams/teams'
import { useGetGroupStandings } from '@Sdk/standings/standings'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

type Props = {
  teamId: string
}

export const CoachStandingCompact = ({ teamId }: Props) => {
  const { data: currentGroup } = useGetTeamCurrentGroup(teamId)
  const { data: standings } = useGetGroupStandings(currentGroup?.groupId ?? null)

  if (!currentGroup || !standings) {
    return (
      <span className="text-muted-foreground text-xs">
        <FormattedMessage id="coachDashboard.standing.notEnrolled" />
      </span>
    )
  }

  const row = standings.rows.find(r => r.teamId === teamId)
  if (!row) {
    return null
  }

  return (
    <Link
      to={`/app/standings?groupId=${currentGroup.groupId}`}
      className="text-primary text-xs font-semibold hover:underline"
    >
      {row.rank} / {standings.rows.length}
    </Link>
  )
}
