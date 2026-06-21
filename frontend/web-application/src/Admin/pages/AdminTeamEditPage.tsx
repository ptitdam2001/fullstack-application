import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/design-system'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { NotFound } from '@Common/NotFound'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { useTeamDetail } from '@Teams/application/useTeamDetail'
import { TeamForm } from '@Teams/ui/TeamForm/TeamForm'

export const AdminTeamEditPage = () => {
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
      <DialogContent>
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
    </Dialog>
  )
}
