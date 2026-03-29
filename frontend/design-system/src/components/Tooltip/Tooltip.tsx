import * as React from 'react'
import { TooltipTrigger as AriaTooltipTrigger } from 'react-aria-components'

type TooltipProps = React.ComponentProps<typeof AriaTooltipTrigger>

function Tooltip({ ...props }: TooltipProps) {
  return <AriaTooltipTrigger data-slot="tooltip" {...props} />
}

export { Tooltip }
