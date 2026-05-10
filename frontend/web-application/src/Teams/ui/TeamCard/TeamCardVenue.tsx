import { MapPin } from 'lucide-react'
import { type Area } from '../../domain/Team'

type Props = { areas: Area[] }

export const TeamCardVenue = ({ areas }: Props) => {
  const primaryArea = areas[0]

  if (!primaryArea) {
    return null
  }

  return (
    <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
      <MapPin className="h-4 w-4 shrink-0" />
      <span>{primaryArea.name ?? primaryArea.city}</span>
    </div>
  )
}
