import * as React from 'react'
import { MenuItem } from 'react-aria-components'
import { CheckIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

type DropdownMenuCheckboxItemProps = Omit<React.ComponentProps<typeof MenuItem>, 'onAction' | 'children'> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  children?: React.ReactNode
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <MenuItem
      data-slot="dropdown-menu-checkbox-item"
      data-checked={checked}
      onAction={() => onCheckedChange?.(!checked)}
      className={cn(
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <CheckIcon className="size-4" />}
      </span>
      {children}
    </MenuItem>
  )
}

export { DropdownMenuCheckboxItem }
