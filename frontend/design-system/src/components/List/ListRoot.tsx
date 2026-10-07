import { ListBox, type ListBoxProps, ListLayout, type ListLayoutOptions, Virtualizer } from 'react-aria-components'
import { type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/cn'
import { listVariants } from './ListVariants'

export type ListRootProps<T extends object> = ListBoxProps<T> &
  VariantProps<typeof listVariants> & {
    layoutOptions?: ListLayoutOptions
  }

export const ListRoot = <T extends object>({
  className,
  variant,
  layoutOptions,
  children,
  ...props
}: ListRootProps<T>) => (
  <Virtualizer layout={ListLayout} layoutOptions={layoutOptions}>
    <ListBox
      data-slot="list"
      className={cn(
        listVariants({ variant }),
        'scrollbar-track-background block scrollbar-thin scrollbar-thumb-gray-600 p-0 dark:scrollbar-thumb-gray-500 dark:scrollbar-track-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </ListBox>
  </Virtualizer>
)
