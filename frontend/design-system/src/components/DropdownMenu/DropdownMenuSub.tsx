import * as React from 'react'
import { SubmenuTrigger } from 'react-aria-components'

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof SubmenuTrigger>) {
  return <SubmenuTrigger data-slot="dropdown-menu-sub" {...props} />
}

export { DropdownMenuSub }
