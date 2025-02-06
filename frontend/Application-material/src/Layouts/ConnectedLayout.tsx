import { Outlet } from 'react-router-dom'
import { TopBar } from '@Common/TopBar'
import { MenuDrawer, MenuToggleButton } from '@Common/Menu'

import { Main } from './components/Main'
import { LateralConnectedMenu } from './components/LateralConnectedMenu'
import { LATERAL_MENU } from '@Application/lateralMenu.config'
import { Breadcrumbs } from '@Common/Breadcrumbs/Breadcrumbs'

export const ConnectedLayout = () => (
  <section className="h-full w-full flex flex-col">
    <TopBar title={<Breadcrumbs />} leftContent={<MenuToggleButton />} />
    <MenuDrawer width="240">
      <LateralConnectedMenu links={LATERAL_MENU} />
    </MenuDrawer>
    <Main className="grow p-1" menuWidth="240px">
      <Outlet />
    </Main>
  </section>
)
