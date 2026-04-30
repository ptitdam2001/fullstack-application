import { Card } from '@repo/design-system'
import { NotFound } from '@Pages/NotFound'
import { PlayerList } from '@Player/index'
import { useParams } from 'react-router'
import { TeamCalendarView } from '../ui/TeamCalendarView'
import { TeamDetailCard } from '../ui/TeamDetailCard'

export const TeamPage = () => {
  const { teamId } = useParams()

  if (!teamId) {
    return <NotFound />
  }

  return (
    <article className="flex h-full w-full gap-1 p-2">
      <section className="flex grow flex-col gap-1">
        <TeamDetailCard teamId={teamId} />

        <Card.Container className="h-72 grow gap-1.5 py-2">
          <Card.Title className="px-2 text-lg">Calendar</Card.Title>

          <Card.Content className="overflow-auto p-2">
            <TeamCalendarView teamId={teamId} />
          </Card.Content>
        </Card.Container>
      </section>
      <Card.Container className="w-1/3 gap-y-1.5 py-2">
        <Card.Title className="px-2 text-lg">Players</Card.Title>
        <Card.Content className="px-0">
          <PlayerList teamId={teamId} className="scrollbar-thin h-[80vh] overflow-auto" />
        </Card.Content>
      </Card.Container>
    </article>
  )
}
