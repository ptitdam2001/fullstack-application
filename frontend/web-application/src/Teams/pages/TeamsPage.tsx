import { TeamList } from '../ui/TeamList/TeamList'
import { Outlet } from 'react-router'
import { CirclePlus, LayoutGrid, List } from 'lucide-react'
import { MenuBar } from '@Common/MenuBar/MenuBar'
import { Button, Layout, Separator } from '@repo/design-system'
import { useLocalStorage } from '@Common/hooks/useLocalstorage'
import { FormattedMessage, useIntl } from '@I18n/translation'

type ViewMode = 'grid' | 'list'

export const TeamsPage = () => {
  const intl = useIntl()
  const [viewMode, setViewMode] = useLocalStorage('teams-view-mode', 'grid') as [ViewMode, (v: ViewMode) => void]

  return (
    <Layout.Root>
      <Layout.Header>
        <MenuBar
          leftActions={[
            {
              url: 'create',
              label: (
                <>
                  <CirclePlus />
                  <span className="sr-only">
                    <FormattedMessage id="teams.createTeam" />
                  </span>
                </>
              ),
            },
          ]}
          rightActions={[
            <div key="view-toggle" className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                aria-label={intl.formatMessage({ id: 'teams.gridView' })}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                aria-label={intl.formatMessage({ id: 'teams.listView' })}
                onClick={() => setViewMode('list')}
              >
                <List />
              </Button>
            </div>,
          ]}
        />
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <TeamList viewMode={viewMode} />
        <Outlet />
      </Layout.Content>
    </Layout.Root>
  )
}
