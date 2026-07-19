import { AreaList } from '../ui/Admin/AreaList'
import { ConfirmDeleteAreaDialog } from '../ui/Admin/ConfirmDeleteAreaDialog'
import { useAreaDelete } from '../application/useAreaDelete'
import type { Area } from '../domain/Area'
import { Link, Outlet } from 'react-router'
import { Edit, HousePlus, Trash2 } from 'lucide-react'
import { Button } from '@repo/design-system'
import { useState } from 'react'

export const AreaPages = () => {
  const [areaToDelete, setAreaToDelete] = useState<Area | null>(null)
  const { deleteArea, isPending } = useAreaDelete()

  const handleConfirmDelete = async () => {
    if (!areaToDelete) {
      return
    }
    await deleteArea(areaToDelete.id)
    setAreaToDelete(null)
  }

  return (
    <article data-testid="AreaAdminPage" className="flex h-full w-full flex-col gap-1 p-2">
      <div className="px-1">
        <Link to="create">
          <HousePlus />
        </Link>
      </div>
      <div className="flex-flex-grow-1">
        <AreaList
          actions={area => (
            <div className="flew-row flex gap-1.5 align-middle">
              <Link to={`${area.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
              <Button variant="ghost" size="icon" onPress={() => setAreaToDelete(area)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />
      </div>

      <ConfirmDeleteAreaDialog
        name={areaToDelete?.name ?? areaToDelete?.city ?? ''}
        open={areaToDelete !== null}
        onOpenChange={open => {
          if (!open) {
            setAreaToDelete(null)
          }
        }}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />

      <Outlet />
    </article>
  )
}
