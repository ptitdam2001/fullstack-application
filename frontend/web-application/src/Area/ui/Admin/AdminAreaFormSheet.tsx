import { FormattedMessage } from 'react-intl'
import { SheetContent, SheetHeader, SheetTitle } from '@repo/design-system'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { NotFound } from '@Common/NotFound'
import { useGetArea } from '../../infrastructure/useAreaApi'
import { AreaForm } from '../AreaForm'

type AdminAreaFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  areaId?: string
}

const EditSheetContent = ({ areaId, onFinish }: { areaId: string; onFinish: VoidFunction }) => {
  const { data, isLoading, isError } = useGetArea(areaId)

  if (isError) {
    return <NotFound />
  }
  if (isLoading) {
    return <LinearProgress />
  }
  return <AreaForm areaId={areaId} defaultValues={data} onFinish={onFinish} />
}

export const AdminAreaFormSheet = ({ open, onOpenChange, areaId }: AdminAreaFormSheetProps) => {
  const handleFinish = () => onOpenChange(false)

  return (
    <SheetContent open={open} onOpenChange={onOpenChange} side="right" className="flex flex-col gap-0 sm:max-w-md">
      <SheetHeader className="border-b px-6 py-4">
        <SheetTitle>
          {areaId ? (
            <FormattedMessage id="adminAreas.dialog.edit.title" />
          ) : (
            <FormattedMessage id="adminAreas.dialog.create.title" />
          )}
        </SheetTitle>
      </SheetHeader>
      <div className="flex grow flex-col overflow-y-auto px-6 py-4">
        {areaId ? <EditSheetContent areaId={areaId} onFinish={handleFinish} /> : <AreaForm onFinish={handleFinish} />}
      </div>
    </SheetContent>
  )
}
