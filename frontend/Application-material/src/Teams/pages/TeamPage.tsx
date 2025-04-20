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
      <section className="flex-grow">
        <TeamDetail teamId={teamId} />
      </section>
      <section className="w-1/3">
        <h5 className="text-xl">Players</h5>
        <PlayerList teamId={teamId} className="overflow-auto scrollbar-thin h-80" />
      </section>
    </article>
  )
}
