import * as React from 'react'
import { TabPanel } from 'react-aria-components'

import { cn } from '../../utils/cn'

type TabsContentProps = Omit<React.ComponentProps<typeof TabPanel>, 'id'> & {
  value: string
}

function TabsContent({ className, value, ...props }: TabsContentProps) {
  return (
    <TabPanel
      id={value}
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { TabsContent }
