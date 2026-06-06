import { usePlayerDashboard } from '@Dashboard/application/usePlayerDashboard'
import { FormattedMessage } from 'react-intl'
import { PlayerTeamCard } from './PlayerTeamCard'

export const PlayerTab = () => {
  const { playerTeams, allTeams, upcomingMatches, allMatches } = usePlayerDashboard()

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {playerTeams.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          <FormattedMessage id="playerDashboard.noTeam" />
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {playerTeams.map(team => (
            <PlayerTeamCard
              key={team.id}
              team={team}
              allTeams={allTeams}
              upcomingMatches={upcomingMatches}
              allMatches={allMatches}
            />
          ))}
        </div>
      )}
    </section>
  )
}
