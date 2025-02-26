import { Address } from '@Common/Address/Address'
import { usePagination } from '@Common/hooks/usePagination'
import { Table } from '@Common/Table/Table'
import { LinearProgress, TablePagination } from '@mui/material'
import { Area } from '@Sdk/model'
import { useCountAllAreas, useGetAreaList } from '@Sdk/sdk'
import React from 'react'

type AeraListProps = {
  actions?: (address: Area) => React.ReactNode
}

export const AreaList = ({ actions }: AeraListProps) => {
  const { changePage, changeRowsPerPage, ...pagination } = usePagination()

  const { data: addresses = [], isLoading } = useGetAreaList({
    page: pagination.page,
    limit: pagination.rowsPerPage,
  })
  const { data: count, isLoading: isCountLoading } = useCountAllAreas()

  if (isLoading || isCountLoading) {
    return <LinearProgress />
  }

  return (
    <section className="w-full h-full flex flex-col gap-0.5">
      <Table.TableContainer>
        <Table.TableHeader>
          <Table.TableHead>Address</Table.TableHead>
          {actions && <Table.TableHead size="50px">Actions</Table.TableHead>}
        </Table.TableHeader>
        <Table.TableBody>
          {addresses.map(address => (
            <Table.TableRow key={address._id}>
              <Table.TableCell>
                <Address address={address} />
              </Table.TableCell>

              {actions && <Table.TableCell className="text-right">{actions(address)}</Table.TableCell>}
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
    </section>
  )
}
