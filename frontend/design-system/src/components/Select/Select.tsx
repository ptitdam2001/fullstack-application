import * as React from 'react'
import { Select as AriaSelect } from 'react-aria-components'

type SelectProps = Omit<React.ComponentProps<typeof AriaSelect>, 'isOpen'> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const Select = ({ open, defaultOpen, onOpenChange, ...props }: SelectProps) => (
  <AriaSelect
    data-slot="select"
    isOpen={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    {...props}
  />
)
