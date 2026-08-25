import { FormattedMessage, useIntl } from 'react-intl'
import { Badge, Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@repo/design-system'
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
  return side === 'home' ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals
}

const STATUS_BADGE_VARIANT: Record<MatchStatus, 'secondary' | 'default' | 'destructive' | 'outline'> = {
  [MatchStatus.SCHEDULED]: 'secondary',
  [MatchStatus.PLAYED]: 'default',
  [MatchStatus.FORFEITED]: 'destructive',
  [MatchStatus.CANCELLED]: 'outline',
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

export const MatchCard = ({ match, onScoreClick, onDeleteClick }: Props) => {
  const intl = useIntl()
  const status = match.status ?? MatchStatus.SCHEDULED
  const hasScore = status === MatchStatus.PLAYED
  const canDelete = status !== MatchStatus.PLAYED && status !== MatchStatus.FORFEITED

  return (
    <Card.Container>
      <Card.Header>
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
      <Card.Content className="flex flex-col gap-2">
        <TeamRow team={match.homeTeam} bold={isWinner(match, 'home')} />
        <div className="text-muted-foreground text-sm">
          {hasScore ? `${match.homeGoals} - ${match.awayGoals}` : '–'}
        </div>
        <TeamRow team={match.awayTeam} bold={isWinner(match, 'away')} />
      </Card.Content>
      <Card.Footer className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{formatDate(match.scheduledAt, intl.locale)}</span>
          <Badge variant={STATUS_BADGE_VARIANT[status]}>
            <FormattedMessage id={STATUS_MESSAGE_ID[status]} />
          </Badge>
        </div>
        {status === MatchStatus.SCHEDULED && (
          <Button size="sm" onPress={() => onScoreClick(match)}>
            <FormattedMessage id="adminMatches.card.enterScore" />
          </Button>
        )}
      </Card.Footer>
    </Card.Container>
  )
}
