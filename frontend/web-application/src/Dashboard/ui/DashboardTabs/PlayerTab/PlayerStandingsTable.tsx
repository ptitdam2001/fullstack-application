import { useGetTeamCurrentGroup, useGetTeams } from '@Sdk/teams/teams'
import { useGetGroupStandings } from '@Sdk/standings/standings'
import { FormattedMessage } from 'react-intl'
import { cn } from '@repo/design-system'

type Props = {
  teamId: string
  userId: string
}

export const PlayerStandingsTable = ({ teamId, userId: _userId }: Props) => {
  const { data: currentGroup } = useGetTeamCurrentGroup(teamId)
  const { data: standings } = useGetGroupStandings(currentGroup?.groupId ?? null)
  const { data: allTeams = [] } = useGetTeams()

  if (!currentGroup || !standings) {
    return (
      <p className="text-muted-foreground text-sm">
        <FormattedMessage id="playerDashboard.notEnrolled" />
      </p>
    )
  }

  const teamNameById = Object.fromEntries(allTeams.map(t => [t.id, t.name]))

  return (
    <div className="overflow-x-auto">
      <h3 className="mb-2 text-sm font-semibold">{currentGroup.groupName}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b text-left text-xs">
            <th className="py-1 pr-3">
              <FormattedMessage id="playerDashboard.standings.rank" />
            </th>
            <th className="py-1 pr-3">
              <FormattedMessage id="playerDashboard.standings.team" />
            </th>
            <th className="py-1 pr-3 text-center">
              <FormattedMessage id="playerDashboard.standings.played" />
            </th>
            <th className="py-1 pr-3 text-center">
              <FormattedMessage id="playerDashboard.standings.won" />
            </th>
            <th className="py-1 pr-3 text-center">
              <FormattedMessage id="playerDashboard.standings.drawn" />
            </th>
            <th className="py-1 pr-3 text-center">
              <FormattedMessage id="playerDashboard.standings.lost" />
            </th>
            <th className="py-1 text-center font-bold">
              <FormattedMessage id="playerDashboard.standings.points" />
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.rows.map(row => (
            <tr
              key={row.teamId}
              className={cn('border-b last:border-0', row.teamId === teamId && 'bg-primary/10 font-bold')}
            >
              <td className="py-1.5 pr-3">{row.rank}</td>
              <td className="py-1.5 pr-3">{teamNameById[row.teamId] ?? row.teamId}</td>
              <td className="py-1.5 pr-3 text-center">{row.played}</td>
              <td className="py-1.5 pr-3 text-center">{row.won}</td>
              <td className="py-1.5 pr-3 text-center">{row.drawn}</td>
              <td className="py-1.5 pr-3 text-center">{row.lost}</td>
              <td className="py-1.5 text-center font-semibold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
