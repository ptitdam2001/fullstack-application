import { useAdminDashboard } from '@Dashboard/application/useAdminDashboard'
import { AdminKpiCards } from './AdminKpiCards'
import { AdminQuickActions } from './AdminQuickActions'
import { AdminLiveFeed } from './AdminLiveFeed'
import { AdminUserPieChart } from './AdminUserPieChart'

export const AdminDashboard = () => {
  const { pendingScoreCount, pendingActivationCount, championshipCount, teamCount, feedEvents, roleDistribution } =
    useAdminDashboard()

  return (
    <section className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <AdminKpiCards
        pendingScoreCount={pendingScoreCount}
        pendingActivationCount={pendingActivationCount}
        championshipCount={championshipCount}
        teamCount={teamCount}
      />
      <AdminQuickActions />
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminLiveFeed events={feedEvents} />
        <AdminUserPieChart distribution={roleDistribution} />
      </div>
    </section>
  )
}
