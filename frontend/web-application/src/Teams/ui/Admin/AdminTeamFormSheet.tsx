import { FormattedMessage } from 'react-intl'
import { SheetContent, SheetHeader, SheetTitle } from '@repo/design-system'
import { NotFound } from '@Common/NotFound'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { useTeamDetail } from '@Teams/application/useTeamDetail'
import { TeamForm } from '@Teams/ui/TeamForm/TeamForm'

type AdminTeamFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId?: string
}

const EditSheetContent = ({
  teamId,
  onFinish,
}: {
  teamId: string
  onFinish: VoidFunction
}) => {
  const { data: currentTeam, isLoading, isError } = useTeamDetail(teamId)

  if (isError) {
    return <NotFound />
  }
  if (isLoading) {
    return <LinearProgress />
  }
  return <TeamForm teamId={teamId} defaultValues={currentTeam} onFinish={onFinish} />
}

export const AdminTeamFormSheet = ({ open, onOpenChange, teamId }: AdminTeamFormSheetProps) => {
  const handleFinish = () => onOpenChange(false)

  return (
    <SheetContent open={open} onOpenChange={onOpenChange} side="right" className="flex flex-col gap-0 sm:max-w-md">
      <SheetHeader className="border-b px-6 py-4">
        <SheetTitle>
          {teamId ? (
            <FormattedMessage id="adminTeams.dialog.edit.title" />
          ) : (
            <FormattedMessage id="adminTeams.dialog.create.title" />
          )}
        </SheetTitle>
      </SheetHeader>
      <div className="flex grow flex-col overflow-y-auto px-6 py-4">
        {teamId ? <EditSheetContent teamId={teamId} onFinish={handleFinish} /> : <TeamForm onFinish={handleFinish} />}
      </div>
    </SheetContent>
  )
}