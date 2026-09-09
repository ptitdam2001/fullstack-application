import { FormattedMessage, useIntl } from 'react-intl'
import { Badge, Button, Card, Separator, Tab, Tabs, TabList, Typography } from '@repo/design-system'
import type { Match } from '../../domain/Match'
import { MatchStatus } from '../../domain/Match'

export type MatchesFilter = 'all' | typeof MatchStatus.SCHEDULED | 'played'

type MatchesPanelProps = {
  matches: Match[]
  filter: MatchesFilter
  onFilterChange: (filter: MatchesFilter) => void
  onViewAll: () => void
}

const MATCH_STATUS_MESSAGE_ID: Record<Match['status'] & string, string> = {
  SCHEDULED: 'championshipDetail.matches.status.scheduled',
  PLAYED: 'championshipDetail.matches.status.played',
  FORFEITED: 'championshipDetail.matches.status.forfeited',
  CANCELLED: 'championshipDetail.matches.status.cancelled',
}

const MatchTeam = ({ name, color, goals }: { name: string; color: string | null; goals: number | string }) => (
  <div className="flex items-center gap-2">
    {color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />}
    <span className="flex-1 truncate text-sm font-medium">{name}</span>
    {goals !== null && <span className="text-sm font-bold">{goals}</span>}
  </div>
)

const MatchRow = ({ match }: { match: Match }) => {
  const intl = useIntl()
  const played = match.status !== MatchStatus.SCHEDULED
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
      <Badge variant="secondary" className="shrink-0">
        <FormattedMessage id={MATCH_STATUS_MESSAGE_ID[match.status ?? MatchStatus.SCHEDULED]} />
      </Badge>
    </div>
  )
}

export const MatchesPanel = ({ matches, filter, onFilterChange, onViewAll }: MatchesPanelProps) => {
  const intl = useIntl()

  return (
    <Card.Container className="bg-secondary gap-2 pt-0 pb-2">
      <Card.Content className="flex flex-row flex-wrap items-center justify-between gap-0 rounded-t-lg bg-gray-300 px-3 py-2">
        <Card.Title className="text-sm">
          <Typography.Title3>
            <FormattedMessage id="championshipDetail.matches.title" />
          </Typography.Title3>
        </Card.Title>
        <Tabs selectedKey={filter} onSelectionChange={key => onFilterChange(key as MatchesFilter)}>
          <TabList aria-label={intl.formatMessage({ id: 'championshipDetail.matches.filter.label' })}>
            <Tab id="all">
              <FormattedMessage id="championshipDetail.matches.filter.all" />
            </Tab>
            <Tab id={MatchStatus.SCHEDULED}>
              <FormattedMessage id="championshipDetail.matches.filter.scheduled" />
            </Tab>
            <Tab id="played">
              <FormattedMessage id="championshipDetail.matches.filter.played" />
            </Tab>
          </TabList>
        </Tabs>
      </Card.Content>
      <Card.Content className="p-0">
        {matches.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center text-sm">
            <FormattedMessage id="championshipDetail.matches.empty" />
          </div>
        ) : (
          matches.map(match => <MatchRow key={match.id} match={match} />)
        )}
      </Card.Content>
      <Separator />
      <Card.Footer className="flex justify-center">
        <Button variant="outline" size="sm" onPress={onViewAll}>
          <FormattedMessage id="championshipDetail.matches.viewAll" />
        </Button>
      </Card.Footer>
    </Card.Container>
  )
}
