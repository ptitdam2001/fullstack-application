import { FormattedMessage, useIntl } from 'react-intl'
import { Badge, Button, Card, Tabs, TabsList, TabsTrigger } from '@repo/design-system'
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

const MatchTeam = ({ name, color, goals }: { name: string; color: string | null; goals: number | null }) => (
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
      <div className="text-muted-foreground w-13 flex-shrink-0 text-xs">
        {match.scheduledAt &&
          new Date(match.scheduledAt).toLocaleDateString(intl.locale, { day: '2-digit', month: 'short' })}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <MatchTeam
          name={home?.name ?? '—'}
          color={home?.color ?? null}
          goals={played ? (match.homeGoals ?? null) : null}
        />
        <MatchTeam
          name={away?.name ?? '—'}
          color={away?.color ?? null}
          goals={played ? (match.awayGoals ?? null) : null}
        />
      </div>
      <Badge variant="secondary" className="flex-shrink-0">
        <FormattedMessage id={MATCH_STATUS_MESSAGE_ID[match.status ?? MatchStatus.SCHEDULED]} />
      </Badge>
    </div>
  )
}

export const MatchesPanel = ({ matches, filter, onFilterChange, onViewAll }: MatchesPanelProps) => (
  <Card.Container>
    <Card.Content className="bg-secondary flex flex-row flex-wrap items-center justify-between gap-2 px-3 py-2">
      <Card.Title className="text-sm">
        <FormattedMessage id="championshipDetail.matches.title" />
      </Card.Title>
      <Tabs value={filter} onValueChange={value => onFilterChange(value as MatchesFilter)}>
        <TabsList>
          <TabsTrigger value="all">
            <FormattedMessage id="championshipDetail.matches.filter.all" />
          </TabsTrigger>
          <TabsTrigger value={MatchStatus.SCHEDULED}>
            <FormattedMessage id="championshipDetail.matches.filter.scheduled" />
          </TabsTrigger>
          <TabsTrigger value="played">
            <FormattedMessage id="championshipDetail.matches.filter.played" />
          </TabsTrigger>
        </TabsList>
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
    <Card.Content className="flex justify-center border-t py-2">
      <Button variant="outline" size="sm" onPress={onViewAll}>
        <FormattedMessage id="championshipDetail.matches.viewAll" />
      </Button>
    </Card.Content>
  </Card.Container>
)
