import { Card } from '@repo/design-system'
import { LoaderCircle } from 'lucide-react'

export const PageLoader = () => (
  <article className="flex min-h-screen items-center justify-center p-4">
    <Card.Container>
      <Card.Content className="flex flex-row gap-2 items-center">
        <LoaderCircle className="size-10 animate-spin" />
        <p>Loading...</p>
      </Card.Content>
    </Card.Container>
  </article>
)
