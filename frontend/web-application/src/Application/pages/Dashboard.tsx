import { AuthProvider } from '@Auth/application/AuthProvider'
import { PageLoader } from '@Common/Loading/PageLoader'
import { DefaultDashboard } from '@Dashboard/ui/DefaultDashboard/DefaultDashboard'

export const Dashboard = () => {
  const { user } = AuthProvider.useAuthValue()

  if (!user) {
    return <PageLoader />
  }

  if (user.roles?.includes('COACH')) {
    return <DefaultDashboard />
  }

  if (user.roles?.includes('ADMIN')) {
    return <DefaultDashboard />
  }

  if (user.roles?.includes('REFEREE')) {
    return <DefaultDashboard />
  }

  return <DefaultDashboard />
}
