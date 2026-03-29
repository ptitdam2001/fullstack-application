import * as React from 'react'
import { Heading } from 'react-aria-components'

import { cn } from '../../utils/cn'

function DialogTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
  return (
    <Heading
      slot="title"
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

export { DialogTitle }
