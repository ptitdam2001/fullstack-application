import { NotFound } from '@Pages/NotFound'
import { getCountAllAreasQueryKey, getGetAreaListQueryKey, useGetArea } from '@Sdk/area/area'
import { AreaForm } from '@Settings/Areas/AreaForm'
import { useNavigate, useParams } from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useTheme } from '@Theme/Provider/ThemeProvider'
import { LinearProgress } from '@Common/Loading/LinearProgress'

export const AreaEditPage = () => {
  const currentTheme = useTheme()
  const [open, setOpen] = React.useState<boolean>(true)

  const { areaId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useGetArea(areaId, { query: { enabled: Boolean(areaId) } })

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
            'fixed left-1/2 top-1/2 flex flex-col',
            'max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md',
            'dark:bg-gray-600 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow'
          )}
        >
          <DialogHeader>
            <DialogTitle>{areaId ? 'Edit' : 'Create'}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex-grow flex flex-col">
            {isError && <NotFound />}
            {isLoading ? (
              <LinearProgress />
            ) : (
              <AreaForm
                defaultValues={data}
                areaId={areaId}
                onFinish={() => {
                  setOpen(false)
                  queryClient.invalidateQueries({ queryKey: [getGetAreaListQueryKey(), getCountAllAreasQueryKey()] })

                  navigate(-1)
                }}
                className="flex-1 fex flex-col gap-26"
              />
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
