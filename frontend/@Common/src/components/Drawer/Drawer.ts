import { DrawerContainer } from './Container/DrawerContainer'
import { DrawerContent } from './Content/DrawerContent'
import { DrawerHeader } from './Header/DrawerHeader'
import { useDrawerToggleOpen } from './hooks/useDrawerToggleOpen'

export const Drawer = {
  Container: DrawerContainer,
  Header: DrawerHeader,
  Content: DrawerContent,
  useDrawerToggleOpen,
}
