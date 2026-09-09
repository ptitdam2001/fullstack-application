import { TabList as AriaTabList, type TabListProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TabList = <T extends object>({ className, ...props }: TabListProps<T>) => (
  <AriaTabList
    data-slot="tab-list"
    className={cn(
      'group/tab-list flex max-w-full [scrollbar-width:none] overflow-x-auto overflow-y-clip',
      'data-[orientation=horizontal]:border-border data-[orientation=horizontal]:border-b',
      'data-[orientation=vertical]:border-border data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-e',
      className
    )}
    {...props}
  />
)
