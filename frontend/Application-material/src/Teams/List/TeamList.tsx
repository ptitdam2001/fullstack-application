import { Table } from '@Common/Table/Table'
import { usePagination } from '@Common/hooks/usePagination'

import { IconButton, LinearProgress, Paper, TablePagination } from '@mui/material'
import { Link } from 'react-router'

import VisibilityIcon from '@mui/icons-material/Visibility'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import GroupsIcon from '@mui/icons-material/Groups'
import PaletteIcon from '@mui/icons-material/Palette'
import { useCountTeams, useGetTeams } from '@Sdk/teams/teams'

export const TeamList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data: teams, isLoading } = useGetTeams({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountTeams()

  return (
    <Paper
      component="section"
      data-testid="TeamList"
      sx={{ overflow: 'hidden' }}
      className="w-full h-full flex flex-col gap-0.5"
    >
      {isLoading || isCountLoading ? (
        <LinearProgress />
      ) : (
        <>
          <Table.TableContainer>
            <Table.TableHeader>
              <Table.TableHead>Name</Table.TableHead>
              <Table.TableHead size="3rem">Color</Table.TableHead>
              <Table.TableHead size="10rem">Actions</Table.TableHead>
            </Table.TableHeader>
            <Table.TableBody>
              {teams?.map(team => (
                <Table.TableRow key={team.id}>
                  <Table.TableCell>{team.name}</Table.TableCell>
                  <Table.TableCell>
                    <PaletteIcon style={{ color: team.color ?? 'inherit', width: '2rem', height: '2rem' }} />
                  </Table.TableCell>
                  <Table.TableCell>
                    <IconButton aria-label="More" color="primary" component={Link} to={`/app/team/${team.id}`}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Players"
                      color="primary"
                      component={Link}
                      to={`/app/team/${team.id}/players`}
                    >
                      <GroupsIcon />
                    </IconButton>
                    <IconButton aria-label="Edit" color="primary" component={Link} to={`${team.id}/edit`}>
                      <ModeEditIcon />
                    </IconButton>
                  </Table.TableCell>
                </Table.TableRow>
              ))}
            </Table.TableBody>
          </Table.TableContainer>
          <div className="min-h-10">
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
          </div>
        </>
      )}
    </Paper>
  )
}
