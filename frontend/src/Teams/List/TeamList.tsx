import { Table } from '@Common/Table/Table'
import { usePagination } from '@Common/hooks/usePagination'

import { Link } from 'react-router'

import { useCountTeams, useGetTeams } from '@Sdk/teams/teams'
import { Button } from '@/components/ui/button'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { Eye, Palette, Pencil, Users } from 'lucide-react'

export const TeamList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data: teams, isLoading } = useGetTeams({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountTeams()

  return (
    <section data-testid="TeamList" className="w-full h-full flex flex-col gap-0.5 overflow-hidden">
      {isLoading || isCountLoading ? (
        <TableLoader nbCols={3} nbRows={10} />
      ) : (
        <>
          <Table.TableContainer>
            <Table.TableHeader>
              <Table.TableHead>Name</Table.TableHead>
              <Table.TableHead className="w-12">Color</Table.TableHead>
              <Table.TableHead className="w-40">Actions</Table.TableHead>
            </Table.TableHeader>
            <Table.TableBody>
              {teams?.map(team => (
                <Table.TableRow key={team.id}>
                  <Table.TableCell>{team.name}</Table.TableCell>
                  <Table.TableCell>
                    <Palette style={{ color: team.color ?? 'inherit', width: '2rem', height: '2rem' }} />
                  </Table.TableCell>
                  <Table.TableCell>
                    <Button variant="outline" size="icon" aria-label="More" color="primary" asChild>
                      <Link to={`/app/team/${team.id}`}>
                        <Eye />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Players" color="primary" asChild>
                      <Link to={`/app/team/${team.id}/players`}>
                        <Users />
                      </Link>
                    </Button>

                    <Button variant="outline" size="icon" aria-label="Edit" color="primary" asChild>
                      <Link to={`${team.id}/edit`}>
                        <Pencil />
                      </Link>
                    </Button>
                  </Table.TableCell>
                </Table.TableRow>
              ))}
            </Table.TableBody>
          </Table.TableContainer>
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
        </>
      )}
    </section>
  )
}
