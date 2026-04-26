import { usePagination } from '@Common/hooks/usePagination'
import { useCountTeams, useGetTeams } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TeamCardGrid } from './TeamCardGrid'
import { TeamCardList } from './TeamCardList'
import { TeamListPagination } from './TeamListPagination'
import { Suspense, use } from 'react'

type ViewMode = 'grid' | 'list'

type TeamListProps = {
  viewMode: ViewMode
}

export const TeamList = ({ viewMode }: TeamListProps) => {
  const { changePage, ...pagination } = usePagination({ page: 0, rowsPerPage: 12 })

  const teams = use(
    useGetTeams({
      page: pagination.page,
      limit: pagination.rowsPerPage,
    }).promise
  )
  const count = use(useCountTeams().promise)

  const totalPages = Math.ceil((count ?? 0) / pagination.rowsPerPage)

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
