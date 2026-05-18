import { AuthProvider } from '@Auth/application/AuthProvider'
import { useCoachDashboard } from '@Dashboard/application/useCoachDashboard'
import { CoachDashboardHeader } from './CoachDashboardHeader'
import { CoachKpiCards } from './CoachKpiCards'
import { CoachTeamTile } from './CoachTeamTile'
import { CoachAgenda } from './CoachAgenda'

export const CoachDashboard = () => {
  const { user } = AuthProvider.useAuthValue()
  const { teams, upcomingMatches, stats } = useCoachDashboard(user?.id ?? '')

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <CoachDashboardHeader firstName={user?.firstName} />
      <CoachKpiCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider">Mes équipes</h2>
          {teams.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune équipe</p>
          ) : (
            <div className="flex flex-col gap-2">
              {teams.map((team) => (
                <CoachTeamTile key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider">Prochains matchs</h2>
          <CoachAgenda matches={upcomingMatches} teams={teams} />
        </div>
      </div>
    </section>
  )
}