import * as React from 'react'
import { Link, type LinkProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

function BreadcrumbLink({ className, ...props }: LinkProps) {
  return (
    <Link
      data-slot="breadcrumb-link"
      className={cn('hover:text-foreground transition-colors', className)}
      {...props}
    />
  )
}

export { BreadcrumbLink }
