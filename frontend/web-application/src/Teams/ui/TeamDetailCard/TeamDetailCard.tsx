import { ErrorBoundary } from '@Common/ErrorBoundary'
import { Suspense } from 'react'
import { useTeamDetailSuspense } from '../../application/useTeamDetail'
import { TeamCard } from '../TeamCard/TeamCard'
import { TeamCardSkeleton } from '../TeamCardSkeleton/TeamCardSkeleton'

type Props = { teamId: string }

const TeamDetailCardInner = ({ teamId }: Props) => {
  const team = useTeamDetailSuspense(teamId).data
  return <TeamCard team={team} />
}

export const TeamDetailCard = ({ teamId }: Props) => (
  <ErrorBoundary>
    <Suspense fallback={<TeamCardSkeleton />}>
      <TeamDetailCardInner teamId={teamId} />
    </Suspense>
  </ErrorBoundary>
)
