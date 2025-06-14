import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { NotFound } from '@Pages/NotFound'
import { PlayerList } from '@Player/index'
import { TeamDetail } from '@Teams/Detail/TeamDetail'
import { useParams } from 'react-router'

export const TeamPage = () => {
  const { teamId } = useParams()

  if (!teamId) {
    return <NotFound />
  }

  return (
    <article className="w-full h-full p-2 flex gap-1">
      <section className="flex-grow flex">
        <TeamDetail teamId={teamId} className="w-full" />
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
