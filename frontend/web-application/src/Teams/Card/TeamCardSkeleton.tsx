import { Card, Skeleton } from '@repo/design-system'

export const TeamCardSkeleton = () => (
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
