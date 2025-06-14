import { usePagination } from '@Common/hooks/usePagination'
import { GameListItem } from './GameListItem/GameListItem'
import { useGetGames } from '@Sdk/games/games'
import { useCountTeams } from '@Sdk/teams/teams'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'

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
          <ul role="list" className="flex-1 flex flex-col gap-2 overflow-y-scroll px-2">
            {data?.map(game => (
              <li key={game.id} role="listitem">
                <GameListItem game={game} />
              </li>
            ))}
          </ul>

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
