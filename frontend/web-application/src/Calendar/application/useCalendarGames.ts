import { useGetGamesByMonth } from '../infrastructure/useCalendarApi'

export const useCalendarGames = (year: number, month: number) => useGetGamesByMonth(year, month)
