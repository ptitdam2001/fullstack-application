import { Button, Card } from '@repo/design-system'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { Link } from 'react-router'
import type { Team } from '../domain/Team'

type Props = { teams: Team[] }

export const TeamCardList = ({ teams }: Props) => (
  <ul className="flex flex-col gap-3">
    {teams.map(team => (
      <li key={team.id}>
        <Card.Container className="w-full flex-row items-center gap-0 overflow-hidden py-4">
          <div className="shrink-0 px-6">
            <Volleyball style={{ color: team.color ?? 'currentColor' }} className="h-10 w-10" />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <Card.Title className="truncate">{team.name}</Card.Title>
            {team.areas.length > 0 && (
              <p className="text-muted-foreground mt-1 truncate text-sm">{team.areas.map(a => a.city).join(' · ')}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1 px-6">
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
