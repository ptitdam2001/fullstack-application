import { ListLoader } from '@Common/Loading'
import { GameListRaw } from '@Game/ListRaw/GameListRaw'
import { useGetTeamCalendar } from '@Sdk/teams/teams'
import { BaseTeamType } from '@Teams/types'
import dayjs from 'dayjs'
import { FunctionComponent } from 'react'

type TeamCalendarProps = BaseTeamType

const COUNT_NEXT_EVENTS = 5

export const TeamCalendar: FunctionComponent<TeamCalendarProps> = ({ teamId }) => {
  const today = dayjs().startOf('day').unix().toString()

  const { data, isLoading } = useGetTeamCalendar(
    teamId,
    {
      page: 1,
      count: COUNT_NEXT_EVENTS,
      startDate: today,
    },
    {
      query: {
        queryKeyHashFn: queryKey => queryKey.join('|'),
      },
    }
  )
  console.log(data)

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-auto">
      <div className="grow rounded-md shadow-md py-1">
        {isLoading ? <ListLoader nbLines={5} /> : <GameListRaw games={data ?? []} />}
      </div>
    </div>
  )
}
