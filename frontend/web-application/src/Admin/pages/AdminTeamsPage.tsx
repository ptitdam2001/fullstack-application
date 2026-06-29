import { Suspense, use, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Layout, Separator, Typography } from '@repo/design-system'
import { CirclePlus } from 'lucide-react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { useTeamList } from '@Teams/application/useTeamList'
import { AdminTeamTable } from '@Teams/ui/Admin/AdminTeamTable'
import { AdminTeamFormSheet } from '@Teams/ui/Admin/AdminTeamFormSheet'
import type { Team } from '@Teams/domain/Team'
import { useGetAgeCategories } from '@AgeCategory/infrastructure/useAgeCategoryApi'
import type { AgeCategory } from '@AgeCategory'

type SheetState = { open: boolean; teamId?: string }

type AdminTeamListContentProps = {
  onEdit: (teamId: string) => void
}

const AdminTeamListContent = ({ onEdit }: AdminTeamListContentProps) => {
  const intl = useIntl()
  const { query, countQuery, pagination, changePage } = useTeamList(25)
  const teams = use(query.promise) as Team[]
  const count = use(countQuery.promise)
  const ageCategoriesQuery = useGetAgeCategories({ page: 1, count: 100 })
  const ageCategories = (ageCategoriesQuery.data ?? []) as AgeCategory[]
  const ageCategoryMap = Object.fromEntries(
    ageCategories.map(ac => [
      ac.id,
      `${ac.label} - ${intl.formatMessage({ id: `adminAgeCategories.genre.${ac.genre}` })}`,
    ])
  )
  const navigate = useNavigate()

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <AdminTeamTable
        teams={teams.map(t => ({
          ...t,
          ageCategoryLabel: t.ageCategoryId ? ageCategoryMap[t.ageCategoryId] : undefined,
        }))}
        onEdit={onEdit}
        onDelete={team => navigate(`${team.id}/delete`)}
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
  const [sheetState, setSheetState] = useState<SheetState>({ open: false })

  const openCreate = () => setSheetState({ open: true, teamId: undefined })
  const openEdit = (teamId: string) => setSheetState({ open: true, teamId })
  const closeSheet = (open: boolean) => setSheetState(s => ({ ...s, open }))

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminTeams.title" />
          </Typography.Title1>
          <Button variant="outline" size="sm" onPress={openCreate}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminTeams.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={5} nbRows={10} />}>
            <AdminTeamListContent onEdit={openEdit} />
          </Suspense>
        </ErrorBoundary>
        <Outlet />
      </Layout.Content>
      <AdminTeamFormSheet open={sheetState.open} onOpenChange={closeSheet} teamId={sheetState.teamId} />
    </Layout.Root>
  )
}
