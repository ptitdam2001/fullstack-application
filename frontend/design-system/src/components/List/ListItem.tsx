import { ListBoxItem, type ListBoxItemProps, composeRenderProps } from 'react-aria-components'

import { cn } from '../../utils/cn'
import { listItemVariants } from './ListItemVariants'

export const ListItem = ({ className, children, ...props }: ListBoxItemProps) => (
  <ListBoxItem
    data-slot="list-item"
    className={composeRenderProps(className, cls => cn(listItemVariants(), 'h-full', cls))}
    {...props}
  >
    {children}
  </ListBoxItem>
)
