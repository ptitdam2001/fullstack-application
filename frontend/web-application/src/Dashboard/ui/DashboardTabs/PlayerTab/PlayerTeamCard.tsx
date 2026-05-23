import { useGetTeamPlayers } from '@Sdk/teams/teams'
import { useGetTeamCurrentGroup } from '@Sdk/teams/teams'
import { MatchStatus } from '@Sdk/model/matchStatus'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import type { Team } from '@Sdk/model/team'
import type { Match } from '@Sdk/model/match'
import { PlayerStandingsTable } from './PlayerStandingsTable'

type Props = {
  team: Team
  userId: string
  upcomingMatches: Match[]
}

export const PlayerTeamCard = ({ team, userId, upcomingMatches }: Props) => {
  const { data: players = [], isLoading } = useGetTeamPlayers(team.id)
  const { data: currentGroup } = useGetTeamCurrentGroup(team.id)

  const isPlayer = players.some((p) => p.userId === userId)

  if (isLoading || !isPlayer) {
    return null
  }

  const teamMatches = upcomingMatches
    .filter((m) => m.status === MatchStatus.SCHEDULED && (m.homeTeamId === team.id || m.awayTeamId === team.id))
    .slice(0, 5)

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {team.color && (
          <span className="size-4 rounded-full flex-shrink-0" style={{ backgroundColor: team.color }} />
        )}
        <div className="flex flex-1 items-center justify-between">
          <Link to={`/app/team/${team.id}`} className="text-primary font-semibold hover:underline">
            {team.name}
          </Link>
          {currentGroup && (
            <span className="text-muted-foreground text-xs">{currentGroup.groupName}</span>
          )}
        </div>
      </div>

      {teamMatches.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">
            <FormattedMessage id="playerDashboard.upcomingMatches.title" />
          </h4>
          <ul className="flex flex-col gap-1">
            {teamMatches.map((m) => (
              <li key={m.id} className="text-muted-foreground text-xs">
                {m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : '—'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider">
          <FormattedMessage id="playerDashboard.standings.title" />
        </h4>
        <PlayerStandingsTable teamId={team.id} userId={userId} />
      </div>
    </div>
  )
}