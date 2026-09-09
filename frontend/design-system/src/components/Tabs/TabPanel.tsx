import { TabPanel as AriaTabPanel, composeRenderProps, type TabPanelProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const TabPanel = ({ className, ...props }: TabPanelProps) => (
  <AriaTabPanel
    data-slot="tab-panel"
    className={composeRenderProps(className, cls =>
      cn(
        'flex-1 rounded-md p-4 text-sm transition-opacity outline-none',
        'data-entering:opacity-0 data-exiting:opacity-0',
        'data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px]',
        cls
      )
    )}
    {...props}
  />
)
