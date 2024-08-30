import { ReactNode } from 'react'
import { DrawerConfigProvider } from '../Provider/DrawerConfigProvider'
import { DrawerOpenProvider } from '../Provider/DrawerOpenProvider'

export type DrawerPosition = 'left' | 'right'

export type DrawerContainerProps = {
  position: DrawerPosition
  onVisibilityChange?: (isOpen: boolean) => void
  children: ReactNode
  opened?: boolean
  width?: string
}

export const DrawerContainer: React.FC<DrawerContainerProps> = ({
  position,
  onVisibilityChange,
  children,
  opened = false,
  width,
}) => (
  <DrawerConfigProvider.Provider value={{ position, opened, onVisibilityChange, width }}>
    <DrawerOpenProvider.Provider>{children}</DrawerOpenProvider.Provider>
  </DrawerConfigProvider.Provider>
)
