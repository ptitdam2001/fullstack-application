import { Suspense, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Layout, Separator, Toast, Typography } from '@repo/design-system'
import { CirclePlus } from 'lucide-react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@repo/design-system'
import { useSeasonListSuspense } from '@Season/application/useSeasonList'
import { useSeasonDelete } from '@Season/application/useSeasonDelete'
import { AdminSeasonTable } from '@Season/ui/Admin/AdminSeasonTable'
import { AdminSeasonFormSheet } from '@Season/ui/Admin/AdminSeasonFormSheet'
import { ConfirmDeleteSeasonDialog } from '@Season/ui/Admin/ConfirmDeleteSeasonDialog'
import type { Season } from '@Season/domain/Season'

type SheetState = { open: boolean; seasonId?: string }
type DeleteState = { open: boolean; season?: Season }

type AdminSeasonListContentProps = {
  onEdit: (id: string) => void
  onDelete: (season: Season) => void
}

const AdminSeasonListContent = ({ onEdit, onDelete }: AdminSeasonListContentProps) => {
  const { query, countQuery, pagination, changePage } = useSeasonListSuspense(25)
  const seasons = query.data
  const count = countQuery.data

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <AdminSeasonTable seasons={seasons} onEdit={onEdit} onDelete={onDelete} />
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

export const AdminSeasonsPage = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const [sheetState, setSheetState] = useState<SheetState>({ open: false })
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false })
  const { deleteSeason, isPending } = useSeasonDelete()

  const openCreate = () => setSheetState({ open: true, seasonId: undefined })
  const openEdit = (id: string) => setSheetState({ open: true, seasonId: id })
  const closeSheet = (open: boolean) => setSheetState(s => ({ ...s, open }))

  const openDelete = (season: Season) => setDeleteState({ open: true, season })
  const closeDelete = (open: boolean) => setDeleteState(s => ({ ...s, open }))

  const handleConfirmDelete = async () => {
    if (!deleteState.season) {
      return
    }
    try {
      await deleteSeason(deleteState.season.id)
      toast(intl.formatMessage({ id: 'adminSeasons.toast.deleted' }))
      setDeleteState({ open: false })
    } catch {
      toast(intl.formatMessage({ id: 'adminSeasons.toast.deleteError' }))
    }
  }

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminSeasons.title" />
          </Typography.Title1>
          <Button variant="outline" size="sm" onPress={openCreate}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminSeasons.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={4} nbRows={10} />}>
            <AdminSeasonListContent onEdit={openEdit} onDelete={openDelete} />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
      <AdminSeasonFormSheet open={sheetState.open} onOpenChange={closeSheet} seasonId={sheetState.seasonId} />
      {deleteState.season && (
        <ConfirmDeleteSeasonDialog
          label={deleteState.season.label}
          open={deleteState.open}
          onOpenChange={closeDelete}
          onConfirm={handleConfirmDelete}
          isPending={isPending}
        />
      )}
    </Layout.Root>
  )
}
