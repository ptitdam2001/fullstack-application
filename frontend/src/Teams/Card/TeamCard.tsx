import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { useGetTeam } from '@Sdk/team/team'
import { BaseTeamType } from '@Teams/types'
import { Suspense, use } from 'react'

type TeamCardProps = BaseTeamType

const TeamCardSkeleton = () => (
  <Card className="py-2 gap-1.5">
    <CardTitle className="text-lg px-2">
      <Skeleton className="w-full h-4" />
    </CardTitle>
    <CardContent>
      <Skeleton className="w-full h-4" />
    </CardContent>
    <CardAction>
      <Skeleton className="w-full h-4" />
    </CardAction>
  </Card>
)

const TeamCardRender = ({ teamId }: TeamCardProps) => {
  const team = use(useGetTeam(teamId).promise)

  return (
    <Card className="py-2 gap-1.5">
      <CardTitle className="text-lg px-2">{team.name}</CardTitle>
      <CardContent></CardContent>
      <CardAction>
        <Button>Learn More</Button>
      </CardAction>
    </Card>
  )
}

export const TeamCard = ({ teamId }: TeamCardProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TeamCardSkeleton />}>
      <TeamCardRender teamId={teamId} />
    </Suspense>
  </ErrorBoundary>
)
