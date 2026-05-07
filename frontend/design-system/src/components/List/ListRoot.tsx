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
    <ListBox data-slot="list" className={cn(listVariants({ variant }), 'block p-0', className)} {...props}>
      {children}
    </ListBox>
  </Virtualizer>
)
