import * as React from 'react'
import { Heading } from 'react-aria-components'

import { cn } from '../../utils/cn'

function SheetTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      slot="title"
      data-slot="sheet-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  )
}

export { SheetTitle }
