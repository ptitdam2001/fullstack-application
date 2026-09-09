import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Card, Separator, Tab, Tabs, TabList, Typography } from '@repo/design-system'
import { MatchRow } from './components/MatchRow'
import type { Match } from '../../domain/Match'
import { MatchStatus } from '../../domain/Match'

export type MatchesFilter = 'all' | typeof MatchStatus.SCHEDULED | 'played'

type MatchesPanelProps = {
  matches: Match[]
  filter: MatchesFilter
  onFilterChange: (filter: MatchesFilter) => void
  onViewAll: () => void
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
