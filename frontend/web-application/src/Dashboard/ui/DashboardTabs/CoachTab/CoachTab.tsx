import { AuthProvider } from '@Auth/application/AuthProvider'
import { useCoachDashboard } from '@Dashboard/application/useCoachDashboard'
import { CoachKpiCards } from '@Dashboard/ui/CoachDashboard/CoachKpiCards'
import { CoachTeamTile } from '@Dashboard/ui/CoachDashboard/CoachTeamTile'
import { CoachAgenda } from '@Dashboard/ui/CoachDashboard/CoachAgenda'
import { CoachStandingCompact } from './CoachStandingCompact'
import { CoachWDLBadges } from './CoachWDLBadges'
import { FormattedMessage } from 'react-intl'

export const CoachTab = () => {
  const { user } = AuthProvider.useAuthValue()

  const { teams, upcomingMatches, allMatches, stats } = useCoachDashboard(user?.id ?? '')

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <CoachKpiCards stats={stats} />

      {teams.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wider uppercase">
            <FormattedMessage id="coachDashboard.standings.title" />
          </h2>
          <div className="flex flex-col gap-2">
            {teams.map(team => (
              <div key={team.id} className="bg-card flex items-center justify-between rounded-lg border px-4 py-2">
                <span className="text-sm font-medium">{team.name}</span>
                <div className="flex items-center gap-4">
                  <CoachStandingCompact teamId={team.id} />
                  <CoachWDLBadges teamId={team.id} matches={allMatches} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wider uppercase">
            <FormattedMessage id="coachDashboard.teams.title" />
          </h2>
          {teams.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              <FormattedMessage id="coachDashboard.noTeam" />
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {teams.map(team => (
                <CoachTeamTile key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wider uppercase">
            <FormattedMessage id="coachDashboard.matches.title" />
          </h2>
          <CoachAgenda matches={upcomingMatches} teams={teams} />
        </div>
      </div>
    </section>
  )
}
