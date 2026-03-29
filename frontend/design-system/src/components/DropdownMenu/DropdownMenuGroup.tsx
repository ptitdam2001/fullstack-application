import * as React from 'react'
import { Section } from 'react-aria-components'

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof Section>) {
  return <Section data-slot="dropdown-menu-group" {...props} />
}

export { DropdownMenuGroup }
