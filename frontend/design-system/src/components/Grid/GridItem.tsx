import { ListBoxItem, type ListBoxItemProps, composeRenderProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { gridItemVariants } from './GridItemVariants'

export const GridItem = ({ className, children, ...props }: ListBoxItemProps) => (
  <ListBoxItem
    data-slot="grid-item"
    className={composeRenderProps(className, cls => cn(gridItemVariants(), 'h-full w-full', cls))}
    {...props}
  >
    {children}
  </ListBoxItem>
)
