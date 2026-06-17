import { NumberField as AriaNumberField, Group, Label, FieldError } from 'react-aria-components'
import type { NumberFieldProps as AriaNumberFieldProps } from 'react-aria-components'
import { MinusIcon, PlusIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'

type NumberFieldProps = Omit<AriaNumberFieldProps, 'children'> & {
  label?: string
}

export const NumberField = ({ label, className, ...props }: NumberFieldProps) => (
  <AriaNumberField
    data-slot="number-field"
    className={cn('flex flex-col gap-1.5', className)}
    {...props}
  >
    {label && <Label className="text-sm font-medium">{label}</Label>}
    <Group className="flex">
      <Button
        slot="decrement"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-r-none border-r-0"
      >
        <MinusIcon className="size-4" />
      </Button>
      <Input className="h-9 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
      <Button
        slot="increment"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-l-none border-l-0"
      >
        <PlusIcon className="size-4" />
      </Button>
    </Group>
    <FieldError className="text-destructive text-sm" />
  </AriaNumberField>
)
