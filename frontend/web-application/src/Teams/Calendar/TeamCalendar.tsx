import { ErrorBoundary } from '@Common/ErrorBoundary'
import { ListLoader } from '@Common/Loading'
import { GameListRaw } from '@Game/ListRaw/GameListRaw'
import { useGetTeamCalendar } from '@Sdk/teams/teams'
import { BaseTeamType } from '@Teams/types'
import dayjs from 'dayjs'
import { Suspense, use } from 'react'

type TeamCalendarProps = BaseTeamType

const COUNT_NEXT_EVENTS = 5

const BaseTeamCalendar = ({ teamId }: TeamCalendarProps) => {
  const today = dayjs().startOf('day').unix().toString()

  const games = use(
    useGetTeamCalendar(
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
    ).promise
  )

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-auto">
      <div className="grow rounded-md shadow-md py-1">
        <GameListRaw games={games ?? []} />
      </div>
    </div>
  )
}

export const TeamCalendar = ({ teamId }: TeamCalendarProps) => (
  <ErrorBoundary>
    <Suspense fallback={<ListLoader nbLines={5} />}>
      <BaseTeamCalendar teamId={teamId} />
    </Suspense>
  </ErrorBoundary>
)
