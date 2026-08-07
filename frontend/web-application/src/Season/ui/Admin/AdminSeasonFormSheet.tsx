import { FormattedMessage } from 'react-intl'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@repo/design-system'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { NotFound } from '@Common/NotFound'
import { useGetSeason } from '../../infrastructure/useSeasonApi'
import { SeasonForm } from './SeasonForm'

type AdminSeasonFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  seasonId?: string
}

const EditSheetContent = ({ seasonId, onFinish }: { seasonId: string; onFinish: VoidFunction }) => {
  const { data, isLoading, isError } = useGetSeason(seasonId)

  if (isError) {
    return <NotFound />
  }
  if (isLoading) {
    return <LinearProgress />
  }
  return <SeasonForm seasonId={seasonId} defaultValues={data} onFinish={onFinish} />
}

export const AdminSeasonFormSheet = ({ open, onOpenChange, seasonId }: AdminSeasonFormSheetProps) => {
  const handleFinish = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>
            {seasonId ? (
              <FormattedMessage id="adminSeasons.dialog.edit.title" />
            ) : (
              <FormattedMessage id="adminSeasons.dialog.create.title" />
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex grow flex-col overflow-y-auto px-6 py-4">
          {seasonId ? (
            <EditSheetContent seasonId={seasonId} onFinish={handleFinish} />
          ) : (
            <SeasonForm onFinish={handleFinish} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
