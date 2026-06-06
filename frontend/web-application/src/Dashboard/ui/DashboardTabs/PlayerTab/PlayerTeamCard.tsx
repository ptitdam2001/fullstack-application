import { useGetTeamCurrentGroup } from '@Sdk/teams/teams'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import type { Team } from '@Sdk/model/team'
import type { Match } from '@Sdk/model/match'
import { PlayerStandingsTable } from './PlayerStandingsTable'
import { PlayerRecentResults } from './PlayerRecentResults'
import { filterRecentResults } from '@Dashboard/application/usePlayerDashboard'

type Props = {
  team: Team
  allTeams: Team[]
  upcomingMatches: Match[]
  allMatches: Match[]
}

export const PlayerTeamCard = ({ team, allTeams, upcomingMatches, allMatches }: Props) => {
  const { data: currentGroup } = useGetTeamCurrentGroup(team.id)

  const teamById = Object.fromEntries(allTeams.map(t => [t.id, t.name]))

  const teamUpcoming = upcomingMatches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id).slice(0, 5)

  const recentResults = filterRecentResults(allMatches, team.id)

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {team.color && <span className="size-4 shrink-0 rounded-full" style={{ backgroundColor: team.color }} />}
        <div className="flex flex-1 items-center justify-between">
          <Link to={`/app/team/${team.id}`} className="text-primary font-semibold hover:underline">
            {team.name}
          </Link>
          {currentGroup && <span className="text-muted-foreground text-xs">{currentGroup.groupName}</span>}
        </div>
      </div>

      {teamUpcoming.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase">
            <FormattedMessage id="playerDashboard.upcomingMatches.title" />
          </h4>
          <ul className="flex flex-col gap-1">
            {teamUpcoming.map(m => {
              const isHome = m.homeTeamId === team.id
              const opponent = isHome ? (teamById[m.awayTeamId] ?? '?') : (teamById[m.homeTeamId] ?? '?')
              return (
                <li key={m.id}>
                  <Link
                    to={`/app/games/${m.id}`}
                    className="text-muted-foreground hover:text-foreground flex items-center justify-between text-xs"
                  >
                    <span>
                      {isHome ? team.name : opponent} vs {isHome ? opponent : team.name}
                    </span>
                    <span>{m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : '—'}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {recentResults.length > 0 && <PlayerRecentResults matches={recentResults} teamId={team.id} teamById={teamById} />}

      <div>
        <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase">
          <FormattedMessage id="playerDashboard.standings.title" />
        </h4>
        <PlayerStandingsTable teamId={team.id} userId="" />
      </div>
    </div>
  )
}
