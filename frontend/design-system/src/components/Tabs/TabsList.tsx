import * as React from 'react'
import { TabList } from 'react-aria-components'

import { cn } from '../../utils/cn'

function TabsList({ className, ...props }: React.ComponentProps<typeof TabList>) {
  return (
    <TabList
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center p-[3px]',
        className
      )}
      {...props}
    />
  )
}

export { TabsList }
