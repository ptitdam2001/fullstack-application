import { NotFound } from '@Pages/NotFound'
import { TeamDetail } from '@Teams/Detail/TeamDetail'
import { useParams } from 'react-router'

export const TeamPage = () => {
  const { teamId } = useParams()

  if (!teamId) {
    return <NotFound />
  }

  return (
    <article className="w-full h-full p-2">
      <TeamDetail teamId={teamId} />
    </article>
  )
}
