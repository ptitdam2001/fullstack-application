import * as React from 'react'
import { Tooltip as AriaTooltip, OverlayArrow } from 'react-aria-components'

import { cn } from '../../utils/cn'

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

function buildPlacement(side?: Side, align?: Align) {
  if (!side) return undefined
  if (!align || align === 'center') return side
  return `${side} ${align}` as React.ComponentProps<typeof AriaTooltip>['placement']
}

type TooltipContentProps = Omit<React.ComponentProps<typeof AriaTooltip>, 'placement' | 'offset' | 'children'> & {
  side?: Side
  align?: Align
  sideOffset?: number
  hidden?: boolean
  children?: React.ReactNode
}

function TooltipContent({
  className,
  sideOffset = 0,
  side,
  align,
  hidden,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <AriaTooltip
      data-slot="tooltip-content"
      placement={buildPlacement(side, align)}
      offset={sideOffset}
      className={cn(
        'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance will-change-transform',
        hidden && 'hidden',
        className
      )}
      {...props}
    >
      {children}
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          viewBox="0 0 8 8"
          className="bg-primary fill-primary z-50 rotate-45 rounded-[2px]"
        >
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
    </AriaTooltip>
  )
}

export { TooltipContent }
