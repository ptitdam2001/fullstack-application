import * as React from 'react'

import { cn } from '../../utils/cn'

function BreadcrumbLink({ className, ...props }: React.ComponentProps<'a'>) {
  return <a data-slot="breadcrumb-link" className={cn('hover:text-foreground transition-colors', className)} {...props} />
}

export { BreadcrumbLink }
