import { NotFound } from '@Pages/NotFound'
import { useGetTeam } from '@Sdk/team/team'
import { getGetTeamsQueryKey } from '@Sdk/teams/teams'
import { useQueryClient } from '@tanstack/react-query'
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
import { cn } from '@/lib/utils'
import { useTheme } from '@Theme/Provider/ThemeProvider'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { TeamForm } from '@Teams/Form/TeamForm'

export const TeamEditPage = () => {
  const currentTheme = useTheme()
  const [open, setOpen] = React.useState<boolean>(true)

  const { teamId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: currentTeam, isLoading, isError } = useGetTeam(teamId, { query: { enabled: Boolean(teamId) } })

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
            'dark:bg-gray-600 p-[25px] shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow'
          )}
        >
          <DialogHeader>
            <DialogTitle>{teamId ? 'Edit' : 'Create'}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="grow flex flex-col">
            {isError && <NotFound />}
            {isLoading ? (
              <LinearProgress />
            ) : (
              <TeamForm
                defaultValues={currentTeam}
                teamId={teamId}
                onFinish={() => {
                  queryClient.invalidateQueries({ queryKey: [getGetTeamsQueryKey()] })
                  navigate(-1)
                }}
              />
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
