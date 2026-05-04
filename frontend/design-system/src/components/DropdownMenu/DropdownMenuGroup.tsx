import * as React from 'react'
import { MenuSection } from 'react-aria-components'

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof MenuSection>) {
  return <MenuSection data-slot="dropdown-menu-group" {...props} />
}

export { DropdownMenuGroup }
