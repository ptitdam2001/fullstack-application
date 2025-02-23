import { usePagination } from '@Common/hooks/usePagination'
import { LinearProgress, TablePagination } from '@mui/material'
import { useCountTeams, useGetGames } from '@Sdk/sdk'
import { GameListItem } from './GameListItem/GameListItem'

export const GameList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data, isLoading } = useGetGames({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountTeams()

  if (isLoading) {
    return <LinearProgress />
  }

  return (
    <section data-testid="GameList" className="flex flex-col h-full">
      {isLoading && isCountLoading ? (
        <LinearProgress />
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
            component="div"
            count={count ?? 0}
            page={pagination.page}
            onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
            rowsPerPage={pagination.rowsPerPage}
            onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              changeRowsPerPage(parseInt(event.target.value, 10))
            }
            className="w-full"
          />
        </>
      )}
    </section>
  )
}
