import { Card } from '@repo/design-system'
import { FolderX } from 'lucide-react'

export const Empty = () => (
  <article className="flex min-h-screen items-center justify-center p-4">
    <Card.Container>
      <Card.Content className="flex flex-row items-center gap-2">
        <FolderX className="size-10" />
        <p>No content...</p>
      </Card.Content>
    </Card.Container>
  </article>
)
