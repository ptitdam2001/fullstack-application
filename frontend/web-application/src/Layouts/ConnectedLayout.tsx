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
        'scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500',
        { dark: currentTheme && ['dark', 'system'].includes(currentTheme) }
      )}
    >
      <ConnectedAppSidebar links={LATERAL_MENU} />

      <SidebarInset className="scrollbar-track-background h-full min-w-0">
        <Layout.Header>
          <TopBar title="Connected App" />
          <Separator orientation="horizontal" className="h-[1vh]" />
          <section className="p-1">
            <Breadcrumbs />
          </section>
          <Separator orientation="horizontal" className="h-[1vh]" />
        </Layout.Header>

        <Layout.Content
          data-testid="connected-layout-page"
          className="scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500 w-full"
        >
          <Outlet />
        </Layout.Content>
      </SidebarInset>
    </SidebarProvider>
  )
}
