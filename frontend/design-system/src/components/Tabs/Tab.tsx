import { Tab as AriaTab, SelectionIndicator, composeRenderProps, type TabProps } from 'react-aria-components'

import { cn } from '../../utils/cn'

export const Tab = ({ className, children, ...props }: TabProps) => (
  <AriaTab
    data-slot="tab"
    className={composeRenderProps(className, cls =>
      cn(
        'text-muted-foreground relative flex cursor-default items-center px-2.5 py-1.5 text-sm font-medium transition-colors outline-none',
        'data-hovered:text-foreground data-focus-visible:text-foreground data-selected:text-foreground',
        'data-disabled:text-muted-foreground/50 data-disabled:pointer-events-none',
        'data-focus-visible:ring-ring/50 data-focus-visible:ring-[3px]',
        cls
      )
    )}
    {...props}
  >
    {composeRenderProps(children, children => (
      <>
        {children}
        <SelectionIndicator
          data-slot="tab-indicator"
          className={cn(
            'bg-primary absolute rounded-full transition-[translate,width,height] duration-200 motion-reduce:transition-none',
            'group-data-[orientation=horizontal]/tab-list:inset-x-0 group-data-[orientation=horizontal]/tab-list:bottom-0 group-data-[orientation=horizontal]/tab-list:h-[3px]',
            'group-data-[orientation=vertical]/tab-list:inset-y-0 group-data-[orientation=vertical]/tab-list:right-0 group-data-[orientation=vertical]/tab-list:w-[3px]'
          )}
        />
      </>
    ))}
  </AriaTab>
)
