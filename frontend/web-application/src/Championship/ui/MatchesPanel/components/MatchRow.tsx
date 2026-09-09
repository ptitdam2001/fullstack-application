import { FormattedMessage, useIntl } from 'react-intl'
import { Badge } from '@repo/design-system'
import type { Match } from '../../../domain/Match'
import { MatchStatus } from '../../../domain/Match'

type Props = {
  match: Match
}

const MATCH_STATUS_MESSAGE_ID: Record<Match['status'] & string, string> = {
  SCHEDULED: 'championshipDetail.matches.status.scheduled',
  PLAYED: 'championshipDetail.matches.status.played',
  FORFEITED: 'championshipDetail.matches.status.forfeited',
  CANCELLED: 'championshipDetail.matches.status.cancelled',
}

const STATUS_BADGE_CLASS: Record<Match['status'] & string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-200',
  PLAYED: 'bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-200',
  FORFEITED: 'bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-300',
}

const MatchTeam = ({ name, color, goals }: { name: string; color: string | null; goals: number | string }) => (
  <div className="flex items-center gap-2">
    {color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />}
    <span className="flex-1 truncate text-sm font-medium">{name}</span>
    {goals !== null && <span className="text-sm font-bold">{goals}</span>}
  </div>
)

export const MatchRow = ({ match }: Props) => {
  const intl = useIntl()
  const status = match.status ?? MatchStatus.SCHEDULED
  const played = status !== MatchStatus.SCHEDULED
  const home = match.homeTeam
  const away = match.awayTeam

  return (
    <div className="border-border flex items-center gap-3 border-b px-3 py-2.5 last:border-0">
      <div className="text-muted-foreground w-13 shrink-0 text-xs">
        {match.scheduledAt &&
          new Date(match.scheduledAt).toLocaleDateString(intl.locale, { day: '2-digit', month: 'short' })}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <MatchTeam
          name={home?.name ?? '—'}
          color={home?.color ?? null}
          goals={played ? (match.homeGoals ?? '-') : '-'}
        />
        <MatchTeam
          name={away?.name ?? '—'}
          color={away?.color ?? null}
          goals={played ? (match.awayGoals ?? '-') : '-'}
        />
      </div>
      <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
        <FormattedMessage id={MATCH_STATUS_MESSAGE_ID[status]} />
      </Badge>
    </div>
  )
}
