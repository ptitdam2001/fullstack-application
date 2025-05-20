import { createContextWithWrite } from '@Common/Context/createContextWithWrite'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData' // ES 2015

dayjs.extend(localeData)

dayjs().localeData()

type CalendarConfig = {
  currentMonth: number
  currentYear: number
  daysInMonth: number
  firstDayOfMonth: number
}

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  currentMonth: dayjs().month(),
  currentYear: dayjs().year(),
  daysInMonth: dayjs().daysInMonth(),
  firstDayOfMonth: dayjs().startOf('month').day(),
}

const CalendarContext = createContextWithWrite<CalendarConfig, Partial<CalendarConfig>>('Calendar')

type CalendarProviderProps = {
  children: React.ReactNode
}

export const CalendarProvider = {
  Provider: ({ children }: CalendarProviderProps) => {
    return <CalendarContext.Provider value={DEFAULT_CALENDAR_CONFIG}>{children}</CalendarContext.Provider>
  },
  useCalendarValue: CalendarContext.useValue,
  useCalendarDispatch: CalendarContext.useDispatch,
}
