import { FormattedMessage, useIntl } from 'react-intl'
import {
  Badge,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
} from '@repo/design-system'
import { EllipsisVertical } from 'lucide-react'
import { MatchStatus } from '../../domain/Match'
import type { Match, MatchTeamSummary } from '../../domain/Match'

type Props = {
  match: Match
  onScoreClick: (match: Match) => void
  onDeleteClick: (match: Match) => void
}

type TeamSide = 'home' | 'away'

const isWinner = (match: Match, side: TeamSide): boolean => {
  if (match.status !== MatchStatus.PLAYED || match.homeGoals == null || match.awayGoals == null) {
    return false
  }
  if (match.homeGoals === match.awayGoals) {
    return false
  }
  if (side === 'home') {
    return match.homeGoals > match.awayGoals
  }
  return match.awayGoals > match.homeGoals
}

const STATUS_BADGE_CLASS: Record<MatchStatus, string> = {
  [MatchStatus.SCHEDULED]: 'bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-200',
  [MatchStatus.PLAYED]: 'bg-green-100 text-green-800 border-transparent dark:bg-green-900 dark:text-green-200',
  [MatchStatus.FORFEITED]: 'bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-200',
  [MatchStatus.CANCELLED]: 'bg-gray-100 text-gray-800 border-transparent dark:bg-gray-800 dark:text-gray-300',
}

const STATUS_MESSAGE_ID: Record<MatchStatus, string> = {
  [MatchStatus.SCHEDULED]: 'adminMatches.tabs.scheduled',
  [MatchStatus.PLAYED]: 'adminMatches.tabs.played',
  [MatchStatus.FORFEITED]: 'adminMatches.tabs.forfeited',
  [MatchStatus.CANCELLED]: 'adminMatches.card.status.cancelled',
}

const formatDate = (date: string | null | undefined, locale: string) =>
  date ? new Date(date).toLocaleDateString(locale) : null

const TeamRow = ({ team, bold }: { team: MatchTeamSummary | null | undefined; bold: boolean }) => (
  <div className="flex items-center gap-2">
    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: team?.color ?? '#9ca3af' }} aria-hidden />
    <span className={bold ? 'font-bold' : undefined}>
      {team?.name ?? <FormattedMessage id="adminMatches.card.teamTbd" />}
    </span>
  </div>
)

const DateMatch = ({ scheduledAt }: Pick<Match, 'scheduledAt'>) => {
  const intl = useIntl()

  return (
    <span className="text-muted-foreground text-sm">
      {scheduledAt ? formatDate(scheduledAt, intl.locale) : intl.formatMessage({ id: 'adminMatches.card.toSchedule' })}
    </span>
  )
}

// TODO - Implement Forfeit
type ScoreRowProps = Pick<Match, 'awayGoals' | 'homeGoals'> & { hasScore: boolean }
const ScoreRow = ({ hasScore, homeGoals, awayGoals }: ScoreRowProps) => (
  <>
    <div data-testid="home-score">{hasScore ? homeGoals : '-'}</div>
    <div data-testid="away-score">{hasScore ? awayGoals : '-'}</div>
  </>
)

export const MatchCard = ({ match, onScoreClick, onDeleteClick }: Props) => {
  const intl = useIntl()
  const status = match.status ?? MatchStatus.SCHEDULED
  const hasScore = status === MatchStatus.PLAYED
  const canDelete = status !== MatchStatus.PLAYED && status !== MatchStatus.FORFEITED

  return (
    <Card.Container className="gap-0 p-0">
      <Card.Header className="rounded-t-lg bg-gray-300 px-2 pt-3 pb-2">
        <Card.Title>{match.championshipName}</Card.Title>
        <Card.Description>{match.stageName}</Card.Description>
        <Card.Action>
          <DropdownMenu>
            <Button variant="ghost" size="icon" aria-label={intl.formatMessage({ id: 'adminMatches.card.menu' })}>
              <EllipsisVertical className="h-4 w-4" />
            </Button>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onScoreClick(match)}>
                <FormattedMessage id={hasScore ? 'adminMatches.card.editScore' : 'adminMatches.card.enterScore'} />
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" disabled={!canDelete} onClick={() => onDeleteClick(match)}>
                <FormattedMessage id="adminMatches.card.delete" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card.Action>
      </Card.Header>
      <Separator />
      <Card.Content className="flex flex-row gap-2 p-4">
        <div className="flex flex-10/12 flex-col gap-2">
          <TeamRow team={match.homeTeam} bold={isWinner(match, 'home')} />
          <TeamRow team={match.awayTeam} bold={isWinner(match, 'away')} />
        </div>
        <div className="text-muted-foreground text-lg">
          <ScoreRow hasScore={hasScore} awayGoals={match.awayGoals} homeGoals={match.homeGoals} />
        </div>
      </Card.Content>

      <Card.Footer className="flex flex-col gap-1 px-0 pb-2">
        <Separator />
        <div className="flex h-9 w-full items-center justify-between px-2">
          <div className="flex gap-2">
            <DateMatch scheduledAt={match.scheduledAt} />
            <Badge variant="outline" className={STATUS_BADGE_CLASS[status]}>
              <FormattedMessage id={STATUS_MESSAGE_ID[status]} />
            </Badge>
          </div>
          <div>
            {status === MatchStatus.SCHEDULED && (
              <Button size="sm" variant="outline" onPress={() => onScoreClick(match)}>
                <FormattedMessage id="adminMatches.card.enterScore" />
              </Button>
            )}
          </div>
        </div>
      </Card.Footer>
    </Card.Container>
  )
}
