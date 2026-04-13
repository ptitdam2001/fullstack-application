import { Card, Button } from '@repo/design-system'
import { Team } from '@Sdk/model'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { Link } from 'react-router'

type TeamCardListProps = {
  teams: Team[]
}

export const TeamCardList = ({ teams }: TeamCardListProps) => (
  <ul className="flex flex-col gap-3">
    {teams.map(team => (
      <li key={team.id}>
      <Card.Container className="flex-row items-center py-4 gap-0 w-full overflow-hidden">
        <div className="px-6 shrink-0">
          <Volleyball style={{ color: team.color ?? 'currentColor' }} className="w-10 h-10" />
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <Card.Title className="truncate">{team.name}</Card.Title>
          {team.areas.length > 0 && (
            <p className="text-muted-foreground text-sm truncate mt-1">
              {team.areas.map(a => a.city).join(' · ')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 px-6 shrink-0">
          <Button variant="outline" size="icon" aria-label="View" asChild>
            <Link to={`/app/team/${team.id}`}>
              <Eye />
            </Link>
          </Button>
          <Button variant="outline" size="icon" aria-label="Players" asChild>
            <Link to={`/app/team/${team.id}/players`}>
              <Users />
            </Link>
          </Button>
          <Button variant="outline" size="icon" aria-label="Edit" asChild>
            <Link to={`${team.id}/edit`}>
              <Pencil />
            </Link>
          </Button>
        </div>
      </Card.Container>
      </li>
    ))}
  </ul>
)
