import { NotFound } from '@Pages/NotFound'
import { PlayerList } from '@Player/List/PlayerList'
import { useParams } from 'react-router'

export const TeamPlayersPage = () => {
  const { teamId } = useParams()

  if (!teamId) {
    return <NotFound />
  }

  return (
    <article className="w-full h-full flex">
      <section className="flex-1">
        <PlayerList teamId={teamId} className="overflow-auto scrollbar-thin" />
      </section>
    </article>
  )
}
