import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/design-system'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { TeamForm } from '@Teams/ui/TeamForm/TeamForm'

export const AdminTeamCreatePage = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <Dialog
      open={open}
      onOpenChange={(newValue: boolean) => {
        setOpen(newValue)
        if (newValue === false) {
          navigate(-1)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <FormattedMessage id="adminTeams.dialog.create.title" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex grow flex-col">
          <TeamForm onFinish={() => navigate(-1)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
