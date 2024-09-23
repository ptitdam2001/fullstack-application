import { Outlet } from 'react-router-dom'
import { TopBar } from '@Common/TopBar'
import { MenuDrawer, MenuToggleButton } from '@Common/Menu'

import PersonIcon from '@mui/icons-material/Person'
import CreateIcon from '@mui/icons-material/Create'

import { Main } from './components/Main'
import { LateralConnectedMenu, MenuElt } from './components/LateralConnectedMenu'

const MENU: MenuElt[] = [
  { label: 'My Profile', url: '/app/my-profile', icon: <PersonIcon /> },
  { label: 'My Team', url: '/app/my-team', icon: <CreateIcon /> },
] as const

export const ConnectedLayout = () => (
  <section className="h-full w-full flex flex-col">
    <TopBar title={'Connected'} leftContent={<MenuToggleButton />} />
    <MenuDrawer width="240">
      <LateralConnectedMenu links={MENU} />
    </MenuDrawer>
    <Main className="flex-grow p-1" menuWidth="240px">
      <Outlet />
    </Main>
  </section>
)
