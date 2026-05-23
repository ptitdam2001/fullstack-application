import { AuthProvider } from '@Auth/application/AuthProvider'
import { usePlayerDashboard } from '@Dashboard/application/usePlayerDashboard'
import { FormattedMessage } from 'react-intl'
import { PlayerTeamCard } from './PlayerTeamCard'

export const PlayerTab = () => {
  const { user } = AuthProvider.useAuthValue()
  const { allTeams, upcomingMatches } = usePlayerDashboard()
  const userId = user?.id ?? ''

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {allTeams.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          <FormattedMessage id="playerDashboard.noTeam" />
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {allTeams.map((team) => (
            <PlayerTeamCard key={team.id} team={team} userId={userId} upcomingMatches={upcomingMatches} />
          ))}
        </div>
      )}
    </section>
  )
}
