import * as React from 'react'
import { Tab } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TabsTriggerProps = Omit<React.ComponentProps<typeof Tab>, 'id'> & {
  value: string
  id?: string
  asChild?: boolean
}

function TabsTrigger({ className, value, id: _id, asChild: _asChild, ...props }: TabsTriggerProps) {
  return (
    <Tab
      id={value}
      data-slot="tabs-trigger"
      className={cn(
        "data-[selected]:bg-background dark:data-[selected]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[selected]:border-input dark:data-[selected]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[selected]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

export { TabsTrigger }
