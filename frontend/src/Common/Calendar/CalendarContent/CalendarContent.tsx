import React from 'react'
import dayjs from 'dayjs'
import { CalendarProvider } from '../CalendarProvider/CalendarProvider'

type CalendarContentProps = {
  className?: string
  children?: (day: Date) => React.ReactNode
}

export const CalendarContent: React.FC<CalendarContentProps> = ({ children, className }) => {
  const { daysInMonth, firstDayOfMonth, currentMonth, currentYear } = CalendarProvider.useCalendarValue()
  const weekdays = dayjs.weekdays()

  return (
    <div className={className}>
      <div className="grid grid-cols-7">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <div key={index} className="full-w min-h-16"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, dayNumber) => (
          <div
            key={`${currentYear}-${currentMonth}-${dayNumber + 1}`}
            className="full-w min-h-16 flex items-center justify-center"
          >
            {children ? (
              children(
                dayjs()
                  .set('month', currentMonth)
                  .set('year', currentYear)
                  .set('date', dayNumber + 1)
                  .toDate()
              )
            ) : (
              <span className="text-center text-sm text-gray-500">{dayNumber + 1}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
