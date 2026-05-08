import { Outlet } from 'react-router'

import { ConnectedAppSidebar } from './components/ConnectedAppSidebar'
import { LATERAL_MENU } from '@Application/lateralMenu.config'
import { Breadcrumbs } from './Breadcrumbs/Breadcrumbs'
import { cn, Layout, SidebarInset, SidebarProvider, Separator } from '@repo/design-system'

import { TopBar } from './TopBar'
import { useTheme } from '@Theme/Provider/ThemeProvider'

export const ConnectedLayout = () => {
  const currentTheme = useTheme()

  return (
    <SidebarProvider
      className={cn(
        'scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500 h-svh',
        { dark: currentTheme && ['dark', 'system'].includes(currentTheme) }
      )}
    >
      <ConnectedAppSidebar links={LATERAL_MENU} />

      <SidebarInset className="scrollbar-track-background min-w-0">
        <Layout.Root>
          <Layout.Header>
            <TopBar />
            <Separator orientation="horizontal" />
            <div className="px-2 py-2">
              <Breadcrumbs />
            </div>
            <Separator orientation="horizontal" />
          </Layout.Header>
          <Layout.Content data-testid="connected-layout-page">
            <Outlet />
          </Layout.Content>
        </Layout.Root>
      </SidebarInset>
    </SidebarProvider>
  )
}
ConnectedLayout.displayName = 'ConnectedLayout'
