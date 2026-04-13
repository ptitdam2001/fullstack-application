import { Card, Button } from '@repo/design-system'
import { Team } from '@Sdk/model'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { Link } from 'react-router'

type TeamCardGridProps = {
  teams: Team[]
}

export const TeamCardGrid = ({ teams }: TeamCardGridProps) => (
  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {teams.map(team => (
      <li key={team.id}>
        <Card.Container className="items-center text-center gap-4">
          <Card.Content className="flex flex-col items-center gap-3">
            <Volleyball style={{ color: team.color ?? 'currentColor' }} className="w-16 h-16" />
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
