import { Address } from '@Common/Address/Address'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { Table } from '@Common/Table/Table'
import { TablePagination } from '@Common/Table/TablePagination'
import type { Area } from '../domain/Area'
import { useAreaList } from '../application/useAreaList'
import React, { Suspense, use } from 'react'

type AreaListProps = {
  actions?: (area: Area) => React.ReactNode
}

const BaseAreaList = ({ actions }: AreaListProps) => {
  const { query, countQuery, pagination, changePage, changeRowsPerPage } = useAreaList()
  const addresses = use(query.promise)
  const count = use(countQuery.promise)

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
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
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          onRowsPerPageChange={event => changeRowsPerPage(parseInt(event.target.value, 10))}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AreaList = (props: AreaListProps) => (
  <ErrorBoundary>
    <Suspense fallback={<TableLoader nbCols={2} nbRows={10} />}>
      <BaseAreaList {...props} />
    </Suspense>
  </ErrorBoundary>
)
