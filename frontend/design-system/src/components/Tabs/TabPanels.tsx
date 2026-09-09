import { TabPanels as AriaTabPanels, type TabPanelsProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TabPanels = <T extends object>({ className, ...props }: TabPanelsProps<T>) => (
  <AriaTabPanels data-slot="tab-panels" className={cn('relative overflow-clip', className)} {...props} />
)
