import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { NotFound } from '@Pages/NotFound'
import { PlayerList } from '@Player/index'
import { TeamCalendar } from '@Teams/Calendar/TeamCalendar'
import { TeamCard } from '@Teams/Card/TeamCard'
import { useParams } from 'react-router'

export const TeamPage = () => {
  const { teamId } = useParams()

  if (!teamId) {
    return <NotFound />
  }

  return (
    <article className="w-full h-full p-2 flex gap-1">
      <section className="grow flex flex-col gap-1">
        <TeamCard teamId={teamId} />

        <Card className="grow py-2 gap-1.5 h-72">
          <CardTitle className="text-lg px-2">Calendar</CardTitle>

          <CardContent className="overflow-auto p-2">
            <TeamCalendar teamId={teamId} />
          </CardContent>
        </Card>
      </section>
      <Card className="w-1/3 py-2 gap-y-1.5">
        <CardTitle className="px-2 text-lg">Players</CardTitle>
        <CardContent className="px-0">
          <PlayerList teamId={teamId} className="overflow-auto scrollbar-thin h-[80vh]" />
        </CardContent>
      </Card>
    </article>
  )
}
