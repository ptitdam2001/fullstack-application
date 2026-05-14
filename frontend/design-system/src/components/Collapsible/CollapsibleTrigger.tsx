import * as React from 'react'
import { Button } from 'react-aria-components'

import { cn } from '../../utils/cn'

type CollapsibleTriggerProps = React.ComponentProps<typeof Button>

export const CollapsibleTrigger = ({ className, children, ...props }: CollapsibleTriggerProps) => (
  <Button
    slot="trigger"
    data-slot="collapsible-trigger"
    className={cn(className)}
    {...props}
  >
    {children}
  </Button>
)

CollapsibleTrigger.displayName = 'CollapsibleTrigger'
