import { FormattedMessage } from 'react-intl'
import type { Match } from '../../domain/Match'
import { MatchCard } from './MatchCard'

type Props = {
  matches: Match[]
  onScoreClick: (match: Match) => void
  onDeleteClick: (match: Match) => void
}

export const MatchCardGrid = ({ matches, onScoreClick, onDeleteClick }: Props) => {
  if (matches.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center py-16 text-center">
        <FormattedMessage id="adminMatches.card.empty" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
      {matches.map(match => (
        <MatchCard key={match.id} match={match} onScoreClick={onScoreClick} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  )
}
