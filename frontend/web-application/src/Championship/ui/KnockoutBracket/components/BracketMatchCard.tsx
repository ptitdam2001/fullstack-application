import { type CSSProperties } from 'react'
import type { Match } from '../../../domain/Match'
import { MatchStatus } from '../../../domain/Match'

type Props = {
  match: Match
  style: CSSProperties
}

const BracketTeamRow = ({ name, goals }: { name: string | null; goals: number | null }) => (
  <div className="flex items-center justify-between gap-1.5 px-2.5 py-2 text-xs font-medium">
    <span className={name ? undefined : 'text-muted-foreground font-normal'}>{name ?? '—'}</span>
    {goals !== null && <span className="font-bold">{goals}</span>}
  </div>
)

export const BracketMatchCard = ({ match, style }: Props) => {
  const played = match.status === MatchStatus.PLAYED

  return (
    <div className="border-border absolute overflow-hidden rounded-md border" style={style}>
      <div className="border-border border-b">
        <BracketTeamRow name={match.homeTeam?.name ?? null} goals={played ? (match.homeGoals ?? null) : null} />
      </div>
      <BracketTeamRow name={match.awayTeam?.name ?? null} goals={played ? (match.awayGoals ?? null) : null} />
    </div>
  )
}
