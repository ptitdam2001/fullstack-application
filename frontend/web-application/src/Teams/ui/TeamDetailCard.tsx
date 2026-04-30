import { ErrorBoundary } from '@Common/ErrorBoundary'
import { Suspense, use } from 'react'
import { useTeamDetail } from '../application/useTeamDetail'
import { TeamCard } from './TeamCard'
import { TeamCardSkeleton } from './TeamCardSkeleton'

type Props = { teamId: string }

const TeamDetailCardInner = ({ teamId }: Props) => {
  const team = use(useTeamDetail(teamId).promise)
  return <TeamCard team={team} />
}

export const TeamDetailCard = ({ teamId }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<TeamCardSkeleton />}>
      <TeamDetailCardInner teamId={teamId} />
    </Suspense>
  </ErrorBoundary>
)
