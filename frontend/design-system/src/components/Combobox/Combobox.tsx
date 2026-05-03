import * as React from 'react'
import { ComboBox as AriaComboBox, Group, Popover, ListBox, Label } from 'react-aria-components'
import type { ComboBoxProps as AriaComboBoxProps } from 'react-aria-components'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

type ComboboxProps = Omit<AriaComboBoxProps<object>, 'children'> & {
  label?: string
  placeholder?: string
  children?: React.ReactNode
}

export const Combobox = ({ label, placeholder, children, className, ...props }: ComboboxProps) => (
  <AriaComboBox
    data-slot="combobox"
    className={cn('flex flex-col gap-1.5', className)}
    {...props}
  >
    {label && <Label className="text-sm font-medium">{label}</Label>}
    <Group className="border-input focus-within:ring-ring/50 focus-within:border-ring flex overflow-hidden rounded-md border focus-within:ring-[3px]">
      <Input
        placeholder={placeholder}
        className="h-9 flex-1 rounded-none border-0 shadow-none focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        className="border-input h-9 w-9 shrink-0 rounded-none border-l"
      >
        <ChevronDownIcon className="size-4" />
      </Button>
    </Group>
    <Popover className="bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-top:slide-in-from-bottom-2 z-50 min-w-[var(--trigger-width)] overflow-hidden rounded-md border shadow-md">
      <ListBox
        data-slot="combobox-listbox"
        className="max-h-60 overflow-y-auto p-1 outline-none"
      >
        {children}
      </ListBox>
    </Popover>
  </AriaComboBox>
)
