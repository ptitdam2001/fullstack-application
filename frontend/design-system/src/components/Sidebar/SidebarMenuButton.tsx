import * as React from 'react'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { Tooltip } from '../Tooltip/Tooltip'
import { useSidebar } from './SidebarContext'
import { sidebarMenuButtonVariants } from './SidebarMenuButtonVariants'

function SidebarMenuButton({
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  isActive?: boolean
  tooltip?: React.ReactNode
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const { isMobile, state } = useSidebar()

  const button = (
    <button
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  return (
    <Tooltip content={tooltip} position="right" delay={0} disabled={state !== 'collapsed' || isMobile}>
      {button}
    </Tooltip>
  )
}

export { SidebarMenuButton }
