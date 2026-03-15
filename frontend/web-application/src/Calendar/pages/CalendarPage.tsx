import { Calendar } from '@Common/Calendar/Calendar'

export const CalendarPage = () => {
  return (
    <Calendar.Container>
      <Calendar.Navigation />
      <Calendar.Content
        children={date => (
          <div className="bg-amber-500 text-orange-700 w-full h-15 border-orange-700 border rounded-sm flex items-center justify-center">
            {date.toLocaleDateString()}
          </div>
        )}
      />
    </Calendar.Container>
  )
}
