import { Suspense, use } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Layout, Separator } from '@repo/design-system'
import { CirclePlus } from 'lucide-react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { useTeamList } from '@Teams/application/useTeamList'
import { AdminTeamTable } from '@Teams/ui/Admin/AdminTeamTable'
import type { Team } from '@Teams/domain/Team'

const AdminTeamListContent = () => {
  const { query, countQuery, pagination, changePage } = useTeamList(25)
  const teams = use(query.promise)
  const count = use(countQuery.promise)
  const navigate = useNavigate()

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <AdminTeamTable
        teams={teams as (Team & { ageCategory?: string })[]}
        onEdit={(teamId) => navigate(`${teamId}/edit`)}
        onDelete={(team) => navigate(`${team.id}/delete`)}
      />
      <div className="min-h-10">
        <TablePagination
          count={(count ?? 0) as number}
          page={pagination.page}
          onPageChange={changePage}
          rowsPerPage={pagination.rowsPerPage}
          className="w-full"
        />
      </div>
    </section>
  )
}

export const AdminTeamsPage = () => {
  const navigate = useNavigate()

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-lg font-semibold">
            <FormattedMessage id="adminTeams.title" />
          </h1>
          <Button variant="outline" size="sm" onPress={() => navigate('create')}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminTeams.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
    <Layout.Content>
      <ErrorBoundary>
        <Suspense fallback={<TableLoader nbCols={5} nbRows={10} />}>
          <AdminTeamListContent />
        </Suspense>
      </ErrorBoundary>
      <Outlet />
    </Layout.Content>
  </Layout.Root>
  )
}
