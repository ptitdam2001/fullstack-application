import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router'
import { cn } from '@repo/design-system'
import type { Match } from '@Sdk/model/match'

type Props = {
  matches: Match[]
  teamId: string
  teamById: Record<string, string>
}

const getOutcome = (match: Match, teamId: string): 'win' | 'draw' | 'loss' => {
  const homeGoals = match.homeGoals ?? 0
  const awayGoals = match.awayGoals ?? 0
  const isHome = match.homeTeamId === teamId
  const teamGoals = isHome ? homeGoals : awayGoals
  const opponentGoals = isHome ? awayGoals : homeGoals

  if (teamGoals > opponentGoals) {
    return 'win'
  }
  if (teamGoals === opponentGoals) {
    return 'draw'
  }
  return 'loss'
}

export const PlayerRecentResults = ({ matches, teamId, teamById }: Props) => {
  const intl = useIntl()

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold tracking-wider uppercase">
        <FormattedMessage id="playerDashboard.recentResults.title" />
      </h4>
      <ul className="flex flex-col gap-1">
        {matches.map((m) => {
          const outcome = getOutcome(m, teamId)
          const isHome = m.homeTeamId === teamId
          const opponent = isHome ? (teamById[m.awayTeamId] ?? '?') : (teamById[m.homeTeamId] ?? '?')
          const score = `${m.homeGoals ?? '?'}–${m.awayGoals ?? '?'}`

          return (
            <li key={m.id}>
              <Link
                to={`/app/games/${m.id}`}
                className="hover:text-foreground flex items-center gap-2 text-xs"
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white',
                    outcome === 'win' && 'bg-green-500',
                    outcome === 'draw' && 'bg-muted-foreground',
                    outcome === 'loss' && 'bg-red-500',
                  )}
                >
                  {intl.formatMessage({ id: `playerDashboard.recentResults.${outcome}` })}
                </span>
                <span className="text-muted-foreground font-mono">{score}</span>
                <span className="text-muted-foreground flex-1 truncate">{opponent}</span>
                <span className="text-muted-foreground shrink-0">
                  {m.scheduledAt ? new Date(m.scheduledAt).toLocaleDateString() : '—'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
