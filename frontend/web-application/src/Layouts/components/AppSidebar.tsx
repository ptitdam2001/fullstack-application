import { AuthProvider } from '@Auth/application/AuthProvider'
import { AdminAppSidebar } from './AdminAppSidebar'
import { CoachAppSidebar } from './CoachAppSidebar'
import { PlayerAppSidebar } from './PlayerAppSidebar'
import { ConnectedAppSidebar } from './ConnectedAppSidebar'
import { LATERAL_MENU } from '@Application/lateralMenu.config'

export const AppSidebar = () => {
  const { user } = AuthProvider.useAuthValue()

  if (!user) {
    return null
  }

  if (user.isAdmin) {
    return <AdminAppSidebar />
  }

  if (user.roles?.includes('COACH')) {
    return <CoachAppSidebar />
  }

  if (user.roles?.includes('PLAYER')) {
    return <PlayerAppSidebar />
  }

  return <ConnectedAppSidebar links={LATERAL_MENU} />
}
