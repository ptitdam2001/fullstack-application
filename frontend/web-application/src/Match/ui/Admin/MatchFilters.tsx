import { Button, Card, Select, SelectItem, Tab, Tabs, TabList } from '@repo/design-system'
import { FormattedMessage, useIntl } from 'react-intl'
import { useChampionshipList } from '@Championship/application/useChampionshipList'
import { useAgeCategoryList } from '@AgeCategory/application/useAgeCategoryList'
import { MatchStatus } from '../../domain/Match'
import type { MatchListFilters } from '../../application/useMatchList'

type Props = {
  filters: MatchListFilters
  onChange: (next: MatchListFilters) => void
  resultCount: number
}

const STATUS_TAB_ALL = 'ALL'

export const MatchFilters = ({ filters, onChange, resultCount }: Props) => {
  const intl = useIntl()
  const championshipList = useChampionshipList(100)
  const ageCategoryList = useAgeCategoryList(100)
  const championships = championshipList.query.data ?? []
  const ageCategories = ageCategoryList.query.data ?? []

  const hasActiveFilter = Boolean(filters.championshipId || filters.ageCategoryId || filters.status)

  return (
    <Card.Container className="bg-accent mx-4 mt-2 p-2">
      <Card.Content className="flex flex-wrap items-center gap-4 px-2">
        <Select
          aria-label={intl.formatMessage({ id: 'adminMatches.filters.championship' })}
          selectedKey={filters.championshipId ?? ''}
          onSelectionChange={key => onChange({ ...filters, championshipId: key === '' ? undefined : (key as string) })}
        >
          <SelectItem id="">{intl.formatMessage({ id: 'adminMatches.filters.championship.all' })}</SelectItem>
          {championships.map(championship => (
            <SelectItem key={championship.id} id={championship.id}>
              {championship.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          aria-label={intl.formatMessage({ id: 'adminMatches.filters.ageCategory' })}
          selectedKey={filters.ageCategoryId ?? ''}
          onSelectionChange={key => onChange({ ...filters, ageCategoryId: key === '' ? undefined : (key as string) })}
        >
          <SelectItem id="">{intl.formatMessage({ id: 'adminMatches.filters.ageCategory.all' })}</SelectItem>
          {ageCategories.map(ageCategory => (
            <SelectItem key={ageCategory.id} id={ageCategory.id}>
              {ageCategory.label}
            </SelectItem>
          ))}
        </Select>

        <Tabs
          selectedKey={filters.status ?? STATUS_TAB_ALL}
          onSelectionChange={key =>
            onChange({ ...filters, status: key === STATUS_TAB_ALL ? undefined : (key as MatchStatus) })
          }
        >
          <TabList aria-label={intl.formatMessage({ id: 'adminMatches.filters.status' })}>
            <Tab id={STATUS_TAB_ALL}>
              <FormattedMessage id="adminMatches.tabs.all" />
            </Tab>
            <Tab id={MatchStatus.SCHEDULED}>
              <FormattedMessage id="adminMatches.tabs.scheduled" />
            </Tab>
            <Tab id={MatchStatus.PLAYED}>
              <FormattedMessage id="adminMatches.tabs.played" />
            </Tab>
            <Tab id={MatchStatus.FORFEITED}>
              <FormattedMessage id="adminMatches.tabs.forfeited" />
            </Tab>
          </TabList>
        </Tabs>

        {hasActiveFilter && (
          <Button variant="outline" size="sm" onPress={() => onChange({})}>
            <FormattedMessage id="adminMatches.filters.reset" />
          </Button>
        )}

        <span className="text-muted-foreground ml-auto text-sm">
          <FormattedMessage id="adminMatches.filters.count" values={{ count: resultCount }} />
        </span>
      </Card.Content>
    </Card.Container>
  )
}
