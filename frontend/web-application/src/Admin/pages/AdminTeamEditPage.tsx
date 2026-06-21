import {
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@repo/design-system'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTheme } from '@Theme/Provider/ThemeProvider'
import { FormattedMessage } from 'react-intl'
import { NotFound } from '@Common/NotFound'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { useTeamDetail } from '@Teams/application/useTeamDetail'
import { TeamForm } from '@Teams/ui/TeamForm/TeamForm'

export const AdminTeamEditPage = () => {
  const currentTheme = useTheme()
  const [open, setOpen] = useState(true)
  const { teamId } = useParams()
  const navigate = useNavigate()

  const { data: currentTeam, isLoading, isError } = useTeamDetail(teamId)

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
              <FormattedMessage id="adminTeams.dialog.edit.title" />
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="flex grow flex-col">
            {isError && <NotFound />}
            {isLoading ? (
              <LinearProgress />
            ) : (
              <TeamForm defaultValues={currentTeam} teamId={teamId} onFinish={() => navigate(-1)} />
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
