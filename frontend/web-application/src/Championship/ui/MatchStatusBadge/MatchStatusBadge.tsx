import { FormattedMessage } from 'react-intl'
import { Badge } from '@repo/design-system'
import { MatchStatus } from '../../domain/Match'

type Props = {
  status: MatchStatus
}

const MESSAGE_ID: Record<MatchStatus, string> = {
  [MatchStatus.SCHEDULED]: 'championshipDetail.matches.status.scheduled',
  [MatchStatus.PLAYED]: 'championshipDetail.matches.status.played',
  [MatchStatus.FORFEITED]: 'championshipDetail.matches.status.forfeited',
  [MatchStatus.CANCELLED]: 'championshipDetail.matches.status.cancelled',
}

const BADGE_CLASS: Record<MatchStatus, string> = {
  [MatchStatus.SCHEDULED]: 'bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-200',
  [MatchStatus.PLAYED]: 'bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-200',
  [MatchStatus.FORFEITED]: 'bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-200',
  [MatchStatus.CANCELLED]: 'bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-300',
}

export const MatchStatusBadge = ({ status }: Props) => (
  <Badge variant="outline" className={BADGE_CLASS[status]} data-status={status} data-testid="match-status-badge">
    <FormattedMessage id={MESSAGE_ID[status]} />
  </Badge>
)
