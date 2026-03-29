import React from 'react'
import { cn } from '@repo/design-system'
import { CalendarProvider } from '../CalendarProvider/CalendarProvider'

type CalendarContainerProps = {
  children: React.ReactNode
  className?: string
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({ children, className }) => {
  return (
    <div className={cn('w-full h-full flex flex-col gap-2', className)}>
      <CalendarProvider.Provider>{children}</CalendarProvider.Provider>
    </div>
  )
}
