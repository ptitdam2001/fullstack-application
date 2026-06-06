import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import { Button } from '@repo/design-system'

type Props = {
  firstName?: string
}

export const CoachDashboardHeader = ({ firstName }: Props) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1 text-sm">Bienvenue, {firstName ?? 'Coach'}</p>
      </div>
      <Button size="sm" onPress={() => navigate('/teams/new')}>
        <Plus className="h-4 w-4" />
        Nouvelle équipe
      </Button>
    </div>
  )
}
