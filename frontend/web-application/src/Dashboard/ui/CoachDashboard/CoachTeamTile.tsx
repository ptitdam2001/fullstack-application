import { useNavigate } from 'react-router'
import type { Team } from '@Sdk/model'

type Props = {
  team: Team
}

export const CoachTeamTile = ({ team }: Props) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      className="bg-background hover:bg-secondary flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left"
      onClick={() => navigate(`/teams/${team.id}`)}
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
        style={{ backgroundColor: team.color ?? 'hsl(var(--primary))' }}
      >
        {team.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{team.name}</div>
        <div className="text-muted-foreground mt-0.5 text-xs">{team.areas?.[0]?.name ?? '—'}</div>
      </div>
    </button>
  )
}