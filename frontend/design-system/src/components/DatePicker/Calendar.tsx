import { DayPicker } from 'react-day-picker'
import type { DayPickerProps } from 'react-day-picker'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '../../utils/cn'
import { ButtonVariants } from '../Button/ButtonVariants'

type CalendarProps = DayPickerProps

export const Calendar = ({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) => (
  <DayPicker
    data-slot="calendar"
    showOutsideDays={showOutsideDays}
    className={cn('p-3', className)}
    classNames={{
      root: 'w-fit',
      months: 'flex flex-col gap-4 sm:flex-row',
      month: 'flex flex-col gap-4',
      month_caption: 'flex items-center justify-center pt-1 relative',
      caption_label: 'text-sm font-medium',
      nav: 'flex items-center gap-1',
      button_previous: cn(
        ButtonVariants({ variant: 'outline', size: 'icon' }),
        'absolute left-1 top-0 size-7 p-0 opacity-50 hover:opacity-100'
      ),
      button_next: cn(
        ButtonVariants({ variant: 'outline', size: 'icon' }),
        'absolute right-1 top-0 size-7 p-0 opacity-50 hover:opacity-100'
      ),
      month_grid: 'w-full border-collapse',
      weekdays: 'flex',
      weekday: 'text-muted-foreground w-8 rounded-md text-center text-[0.8rem] font-normal',
      week: 'mt-2 flex w-full',
      day: 'relative flex size-8 items-center justify-center p-0 text-center text-sm focus-within:z-20',
      day_button: cn(
        ButtonVariants({ variant: 'ghost' }),
        'size-8 p-0 font-normal aria-selected:opacity-100'
      ),
      selected:
        'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md',
      today: 'bg-accent text-accent-foreground rounded-md',
      outside: 'text-muted-foreground opacity-50',
      disabled: 'text-muted-foreground opacity-50',
      range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground rounded-none',
      hidden: 'invisible',
      ...classNames,
    }}
    components={{
      Chevron: ({ orientation, ...rest }) =>
        orientation === 'left' ? (
          <ChevronLeftIcon className="size-4" {...rest} />
        ) : (
          <ChevronRightIcon className="size-4" {...rest} />
        ),
    }}
    {...props}
  />
)
