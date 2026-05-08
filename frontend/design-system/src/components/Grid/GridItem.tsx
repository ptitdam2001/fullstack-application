import { ListBoxItem, type ListBoxItemProps, composeRenderProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { gridItemVariants } from './GridItemVariants'

export const GridItem = ({ className, children, ...props }: ListBoxItemProps) => (
  <ListBoxItem
    data-slot="grid-item"
    className={composeRenderProps(className, cls => cn(gridItemVariants(), 'w-full h-full', cls))}
    {...props}
  >
    {children}
  </ListBoxItem>
)
