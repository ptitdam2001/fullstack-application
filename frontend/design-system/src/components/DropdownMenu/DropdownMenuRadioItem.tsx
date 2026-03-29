import * as React from 'react'
import { MenuItem } from 'react-aria-components'
import { CircleIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { useDropdownMenuRadioGroup } from './DropdownMenuRadioGroup'

type DropdownMenuRadioItemProps = Omit<React.ComponentProps<typeof MenuItem>, 'id' | 'onAction' | 'children'> & {
  value: string
  children?: React.ReactNode
}

function DropdownMenuRadioItem({ className, children, value, ...props }: DropdownMenuRadioItemProps) {
  const ctx = useDropdownMenuRadioGroup()
  const isSelected = ctx?.value === value

  return (
    <MenuItem
      id={value}
      data-slot="dropdown-menu-radio-item"
      data-checked={isSelected}
      onAction={() => ctx?.onValueChange?.(value)}
      className={cn(
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        {isSelected && <CircleIcon className="size-2 fill-current" />}
      </span>
      {children}
    </MenuItem>
  )
}

export { DropdownMenuRadioItem }
