import { Button } from '@repo/design-system'
import { Card } from '@repo/design-system'
import { Skeleton } from '@repo/design-system'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { Team } from '@Sdk/model'
import { useGetTeam } from '@Sdk/team/team'
import { BaseTeamType } from '@Teams/types'
import { Suspense, use } from 'react'

type TeamCardProps = BaseTeamType

const TeamCardSkeleton = () => (
  <Card.Container className="py-2 gap-1.5">
    <Card.Title className="text-lg px-2">
      <Skeleton className="w-full h-4" />
    </Card.Title>
    <Card.Content>
      <Skeleton className="w-full h-4" />
    </Card.Content>
    <Card.Action>
      <Skeleton className="w-full h-4" />
    </Card.Action>
  </Card.Container>
)

type TeamCardRenderProps = {
  team: Team
}

const TeamCardRender = ({ team }: TeamCardRenderProps) => (
  <Card.Container className="py-2 gap-1.5">
    <Card.Title className="text-lg px-2">{team.name}</Card.Title>
    <Card.Content></Card.Content>
    <Card.Action>
      <Button>Learn More</Button>
    </Card.Action>
  </Card.Container>
)

export const TeamCard = ({ teamId }: TeamCardProps) => {
  const team = use(useGetTeam(teamId, { query: { retry: 0 } }).promise)

  return (
    <ErrorBoundary>
      <Suspense fallback={<TeamCardSkeleton />}>
        <TeamCardRender team={team} />
      </Suspense>
    </ErrorBoundary>
  )
}
