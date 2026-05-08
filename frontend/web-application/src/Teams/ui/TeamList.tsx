import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useTeamList } from '../application/useTeamList'
import { TeamCardGrid } from './TeamCardGrid'
import { TeamCardList } from './TeamCardList'
import { TeamListPagination } from './TeamListPagination'
import { Layout, Separator } from '@repo/design-system'
import { Empty } from '@Common/Loading/Empty'

type ViewMode = 'grid' | 'list'

type Props = { viewMode: ViewMode }

export const TeamList = ({ viewMode }: Props) => {
  const { query, pagination, changePage, totalPages } = useTeamList()

  const teams = use(query.promise)

  return (
    <Layout.Root>
      <Layout.Content data-testid="TeamList" className="p-2">
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={3} nbRows={12} />}>
            {teams.length === 0 && <Empty />}
            {viewMode === 'grid' && <TeamCardGrid teams={teams} />}
            {viewMode === 'list' && <TeamCardList teams={teams} />}
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
      <Layout.Footer className="py-1">
        <Separator orientation="horizontal" />

        <TeamListPagination page={pagination.page} totalPages={totalPages} onPageChange={changePage} />
      </Layout.Footer>
    </Layout.Root>
  )
}
