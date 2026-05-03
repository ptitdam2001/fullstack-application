import * as React from 'react'
import { Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger, OverlayArrow } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
  position?: React.ComponentProps<typeof AriaTooltip>['placement']
  delay?: number
  closeDelay?: number
  disabled?: boolean
  offset?: number
  className?: string
}

function Tooltip({ children, content, position, delay = 700, closeDelay = 300, disabled, offset = 0, className }: TooltipProps) {
  return (
    <AriaTooltipTrigger delay={delay} closeDelay={closeDelay} isDisabled={disabled}>
      {children}
      <AriaTooltip
        data-slot="tooltip"
        placement={position}
        offset={offset}
        className={cn(
          'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 placement-bottom:slide-in-from-top-2 placement-left:slide-in-from-right-2 placement-right:slide-in-from-left-2 placement-top:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance will-change-transform',
          className
        )}
      >
        {content}
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8" className="bg-primary fill-primary z-50 rotate-45 rounded-[2px]">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
      </AriaTooltip>
    </AriaTooltipTrigger>
  )
}

export { Tooltip }
export type { TooltipProps }
