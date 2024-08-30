import { DrawerConfigProvider } from '../Provider/DrawerConfigProvider'
import { DrawerOpenProvider } from '../Provider/DrawerOpenProvider'

export const useDrawerToggleOpen = () => {
  const open = DrawerOpenProvider.useDrawerOpen()
  const openDispatch = DrawerOpenProvider.useDrawerOpenDispatch()
  const { onVisibilityChange } = DrawerConfigProvider.useDrawerConfig()

  return () => {
    const newValue = !open
    openDispatch(newValue)
    onVisibilityChange?.(newValue)
  }
}
