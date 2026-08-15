import { useAdminDashboard } from '@Dashboard/application/useAdminDashboard'
import { AdminKpiCards } from './AdminKpiCards'
import { AdminQuickActions } from './AdminQuickActions'
import { AdminLiveFeed } from './AdminLiveFeed'
import { AdminUserPieChart } from './AdminUserPieChart'

export const AdminDashboard = () => {
  const {
    pendingScoreCount,
    pendingActivationCount,
    activeChampionshipCount,
    draftChampionshipCount,
    teamCount,
    feedEvents,
    roleDistribution,
  } = useAdminDashboard()

  return (
    <section className="flex flex-1 flex-col gap-4 p-4">
      <AdminKpiCards
        pendingScoreCount={pendingScoreCount}
        pendingActivationCount={pendingActivationCount}
        activeChampionshipCount={activeChampionshipCount}
        draftChampionshipCount={draftChampionshipCount}
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
