import { AuthProvider } from '@Auth/application/AuthProvider'
import { PageLoader } from '@Common/Loading/PageLoader'
import { AdminDashboard } from '@Dashboard/ui/AdminDashboard/AdminDashboard'
import { DashboardTabs } from '@Dashboard/ui/DashboardTabs/DashboardTabs'

export const Dashboard = () => {
  const { user } = AuthProvider.useAuthValue()

  if (!user) {
    return <PageLoader />
  }

  if (user.isAdmin) {
    return <AdminDashboard />
  }

  return <DashboardTabs roles={user.roles ?? []} />
}
