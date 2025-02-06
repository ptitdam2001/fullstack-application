import { Table } from '@Common/Table/Table'
import { usePagination } from '@Common/hooks/usePagination'

import { IconButton, LinearProgress, TablePagination } from '@mui/material'
import { useCountTeams, useGetTeams } from '@Sdk/sdk'
import { Link, Outlet } from 'react-router-dom'

import VisibilityIcon from '@mui/icons-material/Visibility'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import GroupsIcon from '@mui/icons-material/Groups'
import PaletteIcon from '@mui/icons-material/Palette'

export const TeamList = () => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data: teams, isLoading } = useGetTeams({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountTeams()

  return (
    <section>
      {isLoading && isCountLoading && <LinearProgress />}

      <Table.TableContainer>
        <Table.TableHeader>
          <Table.TableRow>
            <Table.TableHead className="w-md">Name</Table.TableHead>
            <Table.TableHead className="w-8">Color</Table.TableHead>
            <Table.TableHead>Actions</Table.TableHead>
          </Table.TableRow>
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
                <IconButton aria-label="Players" color="primary" component={Link} to={`/app/team/${team.id}/players`}>
                  <GroupsIcon />
                </IconButton>
                <IconButton aria-label="Edit" color="primary" component={Link} to={`/app/team/${team.id}/edit`}>
                  <ModeEditIcon />
                </IconButton>
              </Table.TableCell>
            </Table.TableRow>
          ))}
        </Table.TableBody>
      </Table.TableContainer>
      <TablePagination
        component="div"
        count={count ?? 0}
        page={pagination.page}
        onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
        rowsPerPage={pagination.rowsPerPage}
        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          changeRowsPerPage(parseInt(event.target.value, 10))
        }
      />
      <Outlet />
    </section>
  )
}
