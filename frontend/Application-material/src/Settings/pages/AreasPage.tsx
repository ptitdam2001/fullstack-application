import { AreaList } from '@Settings/Areas/AreaList'

import EditIcon from '@mui/icons-material/Edit'
import { Area } from '@Sdk/model'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@Common/dialog'
import { Button } from '@mui/material'
import { DialogOverlay } from '@radix-ui/react-dialog'

export const AreaPages = () => {
  const handleEdit = (address: Area) => {
    console.log(address)
  }

  return (
    <Dialog>
      <article data-testid="AreaAdminPage" className="w-full h-full p-2 flex gap-1">
        <AreaList
          actions={address => (
            <DialogTrigger aria-label="Edit" onClick={() => handleEdit(address)}>
              <EditIcon />
            </DialogTrigger>
          )}
        />
      </article>

      <DialogPortal>
        <DialogOverlay className="w-full h-full fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <DialogContent className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div>Content</div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
