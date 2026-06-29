import { FormattedMessage } from 'react-intl'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@repo/design-system'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { NotFound } from '@Common/NotFound'
import { useGetAgeCategory } from '../../infrastructure/useAgeCategoryApi'
import { AgeCategoryForm } from './AgeCategoryForm'

type AdminAgeCategoryFormSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ageCategoryId?: string
}

const EditSheetContent = ({ ageCategoryId, onFinish }: { ageCategoryId: string; onFinish: VoidFunction }) => {
  const { data, isLoading, isError } = useGetAgeCategory(ageCategoryId)

  if (isError) {
    return <NotFound />
  }
  if (isLoading) {
    return <LinearProgress />
  }
  return <AgeCategoryForm ageCategoryId={ageCategoryId} defaultValues={data} onFinish={onFinish} />
}

export const AdminAgeCategoryFormSheet = ({ open, onOpenChange, ageCategoryId }: AdminAgeCategoryFormSheetProps) => {
  const handleFinish = () => onOpenChange(false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>
            {ageCategoryId ? (
              <FormattedMessage id="adminAgeCategories.dialog.edit.title" />
            ) : (
              <FormattedMessage id="adminAgeCategories.dialog.create.title" />
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex grow flex-col overflow-y-auto px-6 py-4">
          {ageCategoryId ? (
            <EditSheetContent ageCategoryId={ageCategoryId} onFinish={handleFinish} />
          ) : (
            <AgeCategoryForm onFinish={handleFinish} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
