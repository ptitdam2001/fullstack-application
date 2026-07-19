import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Layout, Separator, Toast, Typography } from '@repo/design-system'
import { CirclePlus, Pencil, Trash2 } from 'lucide-react'
import { AreaList } from '../ui/Admin/AreaList'
import { AdminAreaFormSheet } from '../ui/Admin/AdminAreaFormSheet'
import { ConfirmDeleteAreaDialog } from '../ui/Admin/ConfirmDeleteAreaDialog'
import { useAreaDelete } from '../application/useAreaDelete'
import type { Area } from '../domain/Area'

type SheetState = { open: boolean; areaId?: string }
type DeleteState = { open: boolean; area?: Area }

export const AreasPage = () => {
  const intl = useIntl()
  const toast = Toast.useToast()
  const [sheetState, setSheetState] = useState<SheetState>({ open: false })
  const [deleteState, setDeleteState] = useState<DeleteState>({ open: false })
  const { deleteArea, isPending } = useAreaDelete()

  const openCreate = () => setSheetState({ open: true, areaId: undefined })
  const openEdit = (id: string) => setSheetState({ open: true, areaId: id })
  const closeSheet = (open: boolean) => setSheetState(s => ({ ...s, open }))

  const openDelete = (area: Area) => setDeleteState({ open: true, area })
  const closeDelete = (open: boolean) => setDeleteState(s => ({ ...s, open }))

  const handleConfirmDelete = async () => {
    if (!deleteState.area) {
      return
    }
    try {
      await deleteArea(deleteState.area.id)
      toast(intl.formatMessage({ id: 'adminAreas.toast.deleted' }))
      setDeleteState({ open: false })
    } catch {
      toast(intl.formatMessage({ id: 'adminAreas.toast.deleteError' }))
    }
  }

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex items-center justify-between px-4 py-2">
          <Typography.Title1>
            <FormattedMessage id="adminAreas.title" />
          </Typography.Title1>
          <Button variant="outline" size="sm" onPress={openCreate}>
            <CirclePlus className="h-4 w-4" />
            <FormattedMessage id="adminAreas.action.create" />
          </Button>
        </div>
        <Separator orientation="horizontal" />
      </Layout.Header>
      <Layout.Content>
        <AreaList
          actions={area => (
            <div className="flex justify-end gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label={intl.formatMessage({ id: 'adminAreas.action.edit' })}
                onPress={() => openEdit(area.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={intl.formatMessage({ id: 'adminAreas.action.delete' })}
                onPress={() => openDelete(area)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </Layout.Content>
      <AdminAreaFormSheet open={sheetState.open} onOpenChange={closeSheet} areaId={sheetState.areaId} />
      {deleteState.area && (
        <ConfirmDeleteAreaDialog
          name={deleteState.area.name ?? deleteState.area.city}
          open={deleteState.open}
          onOpenChange={closeDelete}
          onConfirm={handleConfirmDelete}
          isPending={isPending}
        />
      )}
    </Layout.Root>
  )
}
