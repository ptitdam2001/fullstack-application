import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Toast } from '@repo/design-system'
import { useIntl } from 'react-intl'
import { useTeamDetail } from '@Teams/application/useTeamDetail'
import { useTeamDelete } from '@Teams/application/useTeamDelete'
import { ConfirmDeleteDialog } from '@Teams/ui/Admin/ConfirmDeleteDialog'

export const AdminTeamDeletePage = () => {
  const [open, setOpen] = useState(true)
  const { teamId } = useParams()
  const navigate = useNavigate()
  const intl = useIntl()
  const toast = Toast.useToast()

  const { data: team } = useTeamDetail(teamId)
  const { deleteTeam, isPending } = useTeamDelete()

  const handleConfirm = async () => {
    if (!teamId) {
      return
    }
    try {
      await deleteTeam(teamId)
      toast(intl.formatMessage({ id: 'adminTeams.toast.deleted' }))
      navigate(-1)
    } catch {
      toast(intl.formatMessage({ id: 'adminTeams.toast.deleteError' }))
    }
  }

  return (
    <ConfirmDeleteDialog
      teamName={team?.name ?? ''}
      open={open}
      onOpenChange={(newValue) => {
        setOpen(newValue)
        if (newValue === false) {
          navigate(-1)
        }
      }}
      onConfirm={handleConfirm}
      isPending={isPending}
    />
  )
}
