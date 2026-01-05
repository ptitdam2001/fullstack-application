import { usePagination } from '@Common/hooks/usePagination'

import { useCountTeams, useGetTeams } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { TeamTable } from './TeamTable'
import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'

export const TeamList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const teams = use(
    useGetTeams({
      page: pagination.page,
      limit: pagination.rowsPerPage,
    }).promise
  )
  const count = use(useCountTeams().promise)

  return (
    <section data-testid="TeamList" className="w-full h-full flex flex-col gap-0.5 overflow-hidden">
      <ErrorBoundary>
        <Suspense fallback={<TableLoader nbCols={3} nbRows={10} />}>
          <TeamTable teams={teams} />
          <div className="min-h-10">
            <TablePagination
              count={count ?? 0}
              page={pagination.page}
              onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
              rowsPerPage={pagination.rowsPerPage}
              onRowsPerPageChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                changeRowsPerPage(parseInt(event.target.value, 10))
              }
              className="w-full"
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}
