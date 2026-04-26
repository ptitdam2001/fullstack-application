import { Calendar } from '@Common/Calendar/Calendar'

export const CalendarPage = () => {
  return (
    <Calendar.Container>
      <Calendar.Navigation />
      <Calendar.Content
        children={date => (
          <div className="flex h-15 w-full items-center justify-center rounded-sm border border-orange-700 bg-amber-500 text-orange-700">
            {date.toLocaleDateString()}
          </div>
        )}
      />
    </Calendar.Container>
  )
}
