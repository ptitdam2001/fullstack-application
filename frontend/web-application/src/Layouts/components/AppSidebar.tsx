import { AuthProvider } from '@Auth/application/AuthProvider'
import { CoachAppSidebar } from './CoachAppSidebar'
import { ConnectedAppSidebar } from './ConnectedAppSidebar'
import { LATERAL_MENU } from '@Application/lateralMenu.config'

export const AppSidebar = () => {
  const { user } = AuthProvider.useAuthValue()

  if (user?.roles?.includes('COACH')) {
    return <CoachAppSidebar />
  }

  return <ConnectedAppSidebar links={LATERAL_MENU} />
}