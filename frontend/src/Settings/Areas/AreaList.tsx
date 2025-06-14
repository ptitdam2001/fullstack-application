import { Address } from '@Common/Address/Address'
import { usePagination } from '@Common/hooks/usePagination'
import { TableLoader } from '@Common/Loading'
import { Table } from '@Common/Table/Table'
import { TablePagination } from '@Common/Table/TablePagination'
import { useCountAllAreas, useGetAreaList } from '@Sdk/area/area'
import { Area } from '@Sdk/model'
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
    return <TableLoader nbCols={2} nbRows={10} />
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
          count={count ?? 0}
          page={pagination.page}
          onPageChange={(_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => changePage(newPage)}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
          className="w-full"
        />
      </div>
    </section>
  )
}
