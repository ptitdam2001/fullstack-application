import { Outlet } from 'react-router'

import { ConnectedAppSidebar } from './components/ConnectedAppSidebar'
import { LATERAL_MENU } from '@Application/lateralMenu.config'
import { Breadcrumbs } from '@Common/Breadcrumbs/Breadcrumbs'
import { cn } from '@repo/design-system'

import { SidebarInset, SidebarProvider } from '@repo/design-system'
import { Separator } from '@repo/design-system'
import { TopBar } from '@Common/TopBar'
import { useTheme } from '@Theme/Provider/ThemeProvider'

export const ConnectedLayout = () => {
  const currentTheme = useTheme()

  return (
    <SidebarProvider
      className={cn(
        'scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500',
        { dark: currentTheme && ['dark', 'system'].includes(currentTheme) }
      )}
    >
      {/* Left Sidebar */}
      <ConnectedAppSidebar links={LATERAL_MENU} />

      {/* Right Block */}
      <SidebarInset className="h-full scrollbar-track-background">
        <TopBar title="Connected App">
          <Breadcrumbs />
        </TopBar>

        <Separator orientation="horizontal" className="h-[1vh]" />
        <article className="h-[93.5vh] overflow-auto scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500">
          <Outlet />
        </article>
      </SidebarInset>
    </SidebarProvider>
  )
}
