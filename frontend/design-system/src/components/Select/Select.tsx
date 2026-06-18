import * as React from 'react'
import { Select as AriaSelect, Popover, ListBox, Label, Text } from 'react-aria-components'
import type { SelectProps as AriaSelectProps, ValidationResult } from 'react-aria-components'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Button } from '../Button/Button'
import { FieldError } from '../TextField/FieldError'
import { SelectValue } from './SelectValue'

type SelectProps<T extends object> = Omit<AriaSelectProps<T>, 'children'> & {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  items?: Iterable<T>
  children?: React.ReactNode | ((item: T) => React.ReactNode)
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  className,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      data-slot="select"
      className={cn('flex flex-col gap-1.5', className)}
      {...props}
    >
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Button variant="outline" className="w-full justify-between">
        <SelectValue />
        <ChevronDownIcon className="size-4 opacity-50" />
      </Button>
      {description && (
        <Text slot="description" className="text-muted-foreground text-sm">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="bg-popover text-popover-foreground entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 placement-bottom:slide-in-from-top-2 placement-top:slide-in-from-bottom-2 z-50 min-w-(--trigger-width) overflow-hidden rounded-md border shadow-md">
        <ListBox
          data-slot="select-listbox"
          items={items}
          className="max-h-60 overflow-y-auto p-1 outline-none"
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  )
}
