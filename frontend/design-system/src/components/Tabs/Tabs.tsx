import { Tabs as AriaTabs, type TabsProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const Tabs = ({ className, ...props }: TabsProps) => (
  <AriaTabs
    data-slot="tabs"
    className={cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row', className)}
    {...props}
  />
)
