import * as React from 'react'

/**
 * Renders children as-is. react-aria-components positions popovers relative
 * to the DialogTrigger's trigger element by default; a custom anchor is an
 * advanced pattern that can be achieved via triggerRef on the Popover.
 */
function PopoverAnchor({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="popover-anchor" {...props}>
      {children}
    </div>
  )
}

export { PopoverAnchor }
