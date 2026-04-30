import dayjs from 'dayjs'
import { useGetTeamCalendar } from '../infrastructure/useTeamApi'

const COUNT_NEXT_EVENTS = 5

export const useTeamCalendar = (teamId: string | undefined | null) => {
  const today = dayjs().startOf('day').unix().toString()

  return useGetTeamCalendar(
    teamId,
    { page: 1, count: COUNT_NEXT_EVENTS, startDate: today },
    { query: { queryKeyHashFn: queryKey => queryKey.join('|') } }
  )
}
