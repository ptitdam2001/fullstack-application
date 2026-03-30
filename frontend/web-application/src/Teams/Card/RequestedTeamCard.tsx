import { ErrorBoundary } from '@Common/ErrorBoundary'
import { useGetTeam } from '@Sdk/team/team'
import { BaseTeamType } from '@Teams/types'
import { Suspense, use } from 'react'
import { TeamCardSkeleton } from './TeamCardSkeleton'
import { TeamCard } from './TeamCard'

type TeamCardProps = BaseTeamType

export const RequestedTeamCard = ({ teamId }: TeamCardProps) => {
  const team = use(useGetTeam(teamId, { query: { retry: 0 } }).promise)

  return (
    <ErrorBoundary>
      <Suspense fallback={<TeamCardSkeleton />}>
        <TeamCard team={team} />
      </Suspense>
    </ErrorBoundary>
  )
}
