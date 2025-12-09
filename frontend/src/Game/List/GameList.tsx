import { usePagination } from '@Common/hooks/usePagination'
import { useGetGames } from '@Sdk/games/games'
import { useCountTeams } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { GameListRaw } from '@Game/ListRaw/GameListRaw'

export const GameList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data, isLoading } = useGetGames({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountTeams()

  return (
    <section data-testid="GameList" className="flex flex-col h-full">
      {isLoading && isCountLoading ? (
        <TableLoader nbCols={1} nbRows={10} />
      ) : (
        <>
          <GameListRaw games={data ?? []} />

          <TablePagination
            count={count ?? 0}
            page={pagination.page}
            onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
            className="w-full"
          />
        </>
      )}
    </section>
  )
}
