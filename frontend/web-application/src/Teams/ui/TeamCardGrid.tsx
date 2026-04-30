import { Button, Card } from '@repo/design-system'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { Link } from 'react-router'
import type { Team } from '../domain/Team'

type Props = { teams: Team[] }

export const TeamCardGrid = ({ teams }: Props) => (
  <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {teams.map(team => (
      <li key={team.id}>
        <Card.Container className="items-center gap-4 text-center">
          <Card.Content className="flex flex-col items-center gap-3">
            <Volleyball style={{ color: team.color ?? 'currentColor' }} className="h-16 w-16" />
            <Card.Title>{team.name}</Card.Title>
          </Card.Content>
          <Card.Footer className="justify-center gap-1">
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
          </Card.Footer>
        </Card.Container>
      </li>
    ))}
  </ul>
)
