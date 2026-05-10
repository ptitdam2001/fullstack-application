import type { Match, Team } from '@Sdk/model'
import { CoachAgendaRow } from './CoachAgendaRow'

type Props = {
  matches: Match[]
  teams: Team[]
}

export const CoachAgenda = ({ matches, teams }: Props) => {
  const teamById = Object.fromEntries(teams.map((t) => [t.id, t]))

  if (matches.length === 0) {
    return <div className="text-muted-foreground py-10 text-center text-sm">Aucun match à venir</div>
  }

  return (
    <div className="space-y-1">
      {matches.map((match) => (
        <CoachAgendaRow key={match.id} match={match} teamById={teamById} />
      ))}
    </div>
  )
}