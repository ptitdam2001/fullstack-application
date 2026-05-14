import * as React from 'react'
import { Separator as AriaSeparator } from 'react-aria-components'

import { cn } from '../../utils/cn'

type SeparatorProps = {
  className?: string
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
} & Omit<React.ComponentProps<'div'>, 'role'>

export const Separator = ({ className, orientation = 'horizontal', decorative = true, ...props }: SeparatorProps) => {
  if (decorative) {
    return (
      <div
        data-slot="separator"
        role="none"
        data-orientation={orientation}
        className={cn(
          'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
          className
        )}
        {...props}
      />
    )
  }

  return (
    <AriaSeparator
      elementType="div"
      orientation={orientation}
      data-slot="separator"
      data-orientation={orientation}
      className={cn(
        'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}
