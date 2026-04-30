import { Card, Skeleton } from '@repo/design-system'

export const TeamCardSkeleton = () => (
  <Card.Container className="gap-1.5 py-2">
    <Card.Title className="px-2 text-lg">
      <Skeleton className="h-4 w-full" />
    </Card.Title>
    <Card.Content>
      <Skeleton className="h-4 w-full" />
    </Card.Content>
    <Card.Action>
      <Skeleton className="h-4 w-full" />
    </Card.Action>
  </Card.Container>
)
