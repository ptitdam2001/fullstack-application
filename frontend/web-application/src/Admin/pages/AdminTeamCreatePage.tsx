import { cn, Dialog, DialogContent, DialogHeader, DialogPortal, DialogTitle } from '@repo/design-system'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '@Theme/Provider/ThemeProvider'
import { FormattedMessage } from 'react-intl'
import { TeamForm } from '@Teams/ui/TeamForm/TeamForm'

export const AdminTeamCreatePage = () => {
  const currentTheme = useTheme()
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
      <DialogPortal>
        <DialogContent
          className={cn(
            { dark: currentTheme && ['dark', 'system'].includes(currentTheme) },
            'fixed top-1/2 left-1/2 flex flex-col',
            'max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-md',
            'data-[state=open]:animate-contentShow p-6.25 shadow-(--shadow-6) focus:outline-none dark:bg-gray-600'
          )}
        >
          <DialogHeader>
            <DialogTitle>
              <FormattedMessage id="adminTeams.dialog.create.title" />
            </DialogTitle>
          </DialogHeader>
          <div className="flex grow flex-col">
            <TeamForm onFinish={() => navigate(-1)} />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
