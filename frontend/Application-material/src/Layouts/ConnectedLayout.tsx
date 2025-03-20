import { Outlet } from 'react-router'
import { TopBar } from '@Common/TopBar'
import { MenuDrawer, MenuToggleButton } from '@Common/Menu'

import { Main } from './components/Main'
import { LateralConnectedMenu } from './components/LateralConnectedMenu'
import { LATERAL_MENU } from '@Application/lateralMenu.config'
import { Breadcrumbs } from '@Common/Breadcrumbs/Breadcrumbs'
import { useColorScheme } from '@mui/material'
import { className as cn } from '@Common/utils/className'

export const ConnectedLayout = () => {
  const { mode } = useColorScheme()

  return (
    <section
      className={cn(
        { dark: mode && ['dark', 'system'].includes(mode) },
        'h-full w-full flex flex-col',
        'scrollbar-track-background scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-500'
      )}
    >
      <TopBar title={<Breadcrumbs />} leftContent={<MenuToggleButton />} />
      <MenuDrawer width="240">
        <LateralConnectedMenu links={LATERAL_MENU} />
      </MenuDrawer>
      <Main className="flex-col overflow-auto grow p-1 " menuWidth="240px">
        <Outlet />
      </Main>
    </section>
  )
}
