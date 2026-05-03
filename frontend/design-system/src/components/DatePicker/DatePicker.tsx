import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Button } from '../Button/Button'
import { Popover } from '../Popover/Popover'
import { PopoverContent } from '../Popover/PopoverContent'
import { Calendar } from './Calendar'

type DatePickerProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  isDisabled?: boolean
  className?: string
  label?: React.ReactNode
}

function formatDate(date: Date | undefined): string {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const DatePicker = ({ value, onChange, placeholder = 'JJ/MM/AAAA', isDisabled, className, label }: DatePickerProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div data-slot="date-picker" className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-sm font-medium">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <Button
          variant="outline"
          isDisabled={isDisabled}
          className={cn(
            'w-full justify-start gap-2 font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? formatDate(value) : <span>{placeholder}</span>}
        </Button>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={date => {
              onChange?.(date)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
