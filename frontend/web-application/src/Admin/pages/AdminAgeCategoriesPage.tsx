import { Suspense, use, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Layout, Separator, Toast, Typography } from '@repo/design-system'
import { CirclePlus } from 'lucide-react'
import { ErrorBoundary } from '@Common/ErrorBoundary'
import { TableLoader } from '@Common/Loading'
import { TablePagination } from '@Common/Table/TablePagination'
import { useAgeCategoryList } from '@AgeCategory/application/useAgeCategoryList'
import { useAgeCategoryDelete } from '@AgeCategory/application/useAgeCategoryDelete'
import { AdminAgeCategoryTable } from '@AgeCategory/ui/Admin/AdminAgeCategoryTable'
import { AdminAgeCategoryFormSheet } from '@AgeCategory/ui/Admin/AdminAgeCategoryFormSheet'
import { ConfirmDeleteAgeCategoryDialog } from '@AgeCategory/ui/Admin/ConfirmDeleteAgeCategoryDialog'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'

type SheetState = { open: boolean; ageCategoryId?: string }
type DeleteState = { open: boolean; ageCategory?: AgeCategory }

type AdminAgeCategoryListContentProps = {
  onEdit: (id: string) => void
  onDelete: (ageCategory: AgeCategory) => void
}

const AdminAgeCategoryListContent = ({ onEdit, onDelete }: AdminAgeCategoryListContentProps) => {
  const { query, countQuery, pagination, changePage } = useAgeCategoryList(25)
  const ageCategories = use(query.promise)
  const count = use(countQuery.promise)

  return (
    <section className="flex h-full w-full flex-col gap-0.5">
      <AdminAgeCategoryTable ageCategories={ageCategories as AgeCategory[]} onEdit={onEdit} onDelete={onDelete} />
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

export const AdminAgeCategoriesPage = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const [sheetState, setSheetState] = useState<SheetState>({ open: false })
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false })
  const { deleteAgeCategory, isPending } = useAgeCategoryDelete()

  const openCreate = () => setSheetState({ open: true, ageCategoryId: undefined })
  const openEdit = (id: string) => setSheetState({ open: true, ageCategoryId: id })
  const closeSheet = (open: boolean) => setSheetState(s => ({ ...s, open }))

  const openDelete = (ageCategory: AgeCategory) => setDeleteState({ open: true, ageCategory })
  const closeDelete = (open: boolean) => setDeleteState(s => ({ ...s, open }))

  const handleConfirmDelete = async () => {
    if (!deleteState.ageCategory) {
      return
    }
    try {
      await deleteAgeCategory(deleteState.ageCategory.id)
      toast(intl.formatMessage({ id: 'adminAgeCategories.toast.deleted' }))
      setDeleteState({ open: false })
    } catch {
      toast(intl.formatMessage({ id: 'adminAgeCategories.toast.deleteError' }))
    }
  }

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminAgeCategories.title" />
          </Typography.Title1>
          <Button variant="outline" size="sm" onPress={openCreate}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminAgeCategories.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <ErrorBoundary>
          <Suspense fallback={<TableLoader nbCols={3} nbRows={10} />}>
            <AdminAgeCategoryListContent onEdit={openEdit} onDelete={openDelete} />
          </Suspense>
        </ErrorBoundary>
      </Layout.Content>
      <AdminAgeCategoryFormSheet
        open={sheetState.open}
        onOpenChange={closeSheet}
        ageCategoryId={sheetState.ageCategoryId}
      />
      {deleteState.ageCategory && (
        <ConfirmDeleteAgeCategoryDialog
          label={deleteState.ageCategory.label}
          open={deleteState.open}
          onOpenChange={closeDelete}
          onConfirm={handleConfirmDelete}
          isPending={isPending}
        />
      )}
    </Layout.Root>
  )
}
