import { Suspense, use } from 'react'
import { useGameList } from '../application/useGameList'
import { GameListRaw } from './GameListRaw'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { ErrorBoundary } from '@Common/ErrorBoundary'

const GameListInner = () => {
  const { query, countQuery, pagination, changePage, changeRowsPerPage } = useGameList()
  const games = use(query.promise)
  const count = use(countQuery.promise)

  return (
    <section data-testid="GameList" className="flex h-full flex-col">
      <GameListRaw games={games ?? []} />
      <TablePagination
        count={count ?? 0}
        page={pagination.page}
        onPageChange={changePage}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
        className="w-full"
      />
    </section>
  )
}

export const GameList = () => (
  <ErrorBoundary>
    <Suspense fallback={<TableLoader nbCols={1} nbRows={10} />}>
      <GameListInner />
    </Suspense>
  </ErrorBoundary>
)
