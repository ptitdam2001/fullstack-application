import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { useTeamList } from '../application/useTeamList'
import { TeamCardGrid } from './TeamCardGrid'
import { TeamCardList } from './TeamCardList'
import { TeamListPagination } from './TeamListPagination'

type ViewMode = 'grid' | 'list'

type Props = { viewMode: ViewMode }

export const TeamList = ({ viewMode }: Props) => {
  const { query, pagination, changePage, totalPages } = useTeamList()

  const teams = use(query.promise)

  return (
    <section data-testid="TeamList" className="flex w-full flex-1 flex-col overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<TableLoader nbCols={3} nbRows={12} />}>
          <div key={pagination.page} className="flex-1 overflow-auto p-4">
            {viewMode === 'grid' ? <TeamCardGrid teams={teams} /> : <TeamCardList teams={teams} />}
          </div>
          <div className="bg-background h-18 border-t py-2">
            <TeamListPagination page={pagination.page} totalPages={totalPages} onPageChange={changePage} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}
