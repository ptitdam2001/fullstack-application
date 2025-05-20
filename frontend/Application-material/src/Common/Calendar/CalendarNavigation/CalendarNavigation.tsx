import dayjs from 'dayjs'
import { CalendarProvider } from '../CalendarProvider/CalendarProvider'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

type CalendarNavigationProps = {
  onChangeMonth?: (month: number, year: number) => void
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({ onChangeMonth }) => {
  const { currentMonth, currentYear } = CalendarProvider.useCalendarValue()
  const dispatch = CalendarProvider.useCalendarDispatch()
  const currentDate = dayjs().set('month', currentMonth).set('year', currentYear)

  const setPreviousMonth = () => {
    const previousMonth = currentDate.subtract(1, 'month')
    const newMonth = previousMonth.month()
    const newYear = previousMonth.year()
    const firstDayOfMonth = previousMonth.startOf('month').day()
    dispatch({ currentMonth: newMonth, currentYear: newYear, firstDayOfMonth })
    onChangeMonth?.(newMonth, newYear)
  }

  const setNextMonth = () => {
    const previousMonth = currentDate.add(1, 'month')
    const newMonth = previousMonth.month()
    const newYear = previousMonth.year()
    const firstDayOfMonth = previousMonth.startOf('month').day()
    dispatch({ currentMonth: newMonth, currentYear: newYear, firstDayOfMonth })
    onChangeMonth?.(newMonth, newYear)
  }

  return (
    <div>
      <Button variant="outline" size="icon" onClick={setPreviousMonth}>
        <ChevronLeft />
      </Button>
      {currentDate.format('YYYY-MMMM')}
      <Button variant="outline" size="icon" onClick={setNextMonth}>
        <ChevronRight />
      </Button>
    </div>
  )
}
