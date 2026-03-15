import { usePagination } from '@Common/hooks/usePagination'
import { useGetGames } from '@Sdk/games/games'
import { useCountTeams } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { GameListRaw } from '@Game/ListRaw/GameListRaw'
import { Suspense, use } from 'react'
import { ErrorBoundary } from '@Common/ErrorBoundary'

export const GameList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const games = use(
    useGetGames({
      page: pagination.page,
      limit: pagination.rowsPerPage,
    }).promise
  )

  const count = use(useCountTeams().promise)

  return (
    <section data-testid="GameList" className="flex flex-col h-full">
      <ErrorBoundary>
        <Suspense fallback={<TableLoader nbCols={1} nbRows={10} />}>
          <GameListRaw games={games ?? []} />

          <TablePagination
            count={count ?? 0}
            page={pagination.page}
            onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
            className="w-full"
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}
