import { ErrorBoundary } from '@Common/ErrorBoundary'
import { ListLoader } from '@Common/Loading'
import { GameListRaw } from '@Game/ui/GameListRaw'
import { Suspense } from 'react'
import { useTeamCalendar } from '../../application/useTeamCalendar'

type Props = { teamId: string }

const TeamCalendarViewInner = ({ teamId }: Props) => {
  const games = useTeamCalendar(teamId).data

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-auto">
      <div className="grow rounded-md py-1 shadow-md">
        <GameListRaw games={games ?? []} />
      </div>
    </div>
  )
}

export const TeamCalendarView = ({ teamId }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<ListLoader nbLines={5} />}>
      <TeamCalendarViewInner teamId={teamId} />
    </Suspense>
  </ErrorBoundary>
)
