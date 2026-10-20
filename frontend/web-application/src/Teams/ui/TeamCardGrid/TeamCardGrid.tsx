import { Button, Card, Grid } from '@repo/design-system'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useIntl } from '@I18n/translation'
import type { Team } from '../../domain/Team'

type Props = { teams: Team[] }

export const TeamCardGrid = ({ teams }: Props) => {
  const navigate = useNavigate()
  const intl = useIntl()
  return (
    <Grid.Root
      aria-label={intl.formatMessage({ id: 'teams.title' })}
      items={teams}
      variant="ghost"
      className="h-full"
      layoutOptions={{ minItemSize: { width: 200, height: 220 } }}
    >
      {team => (
        <Grid.Item id={team.id} textValue={team.name}>
          <Card.Container className="h-full items-center gap-4 text-center">
            <Card.Content className="flex flex-col items-center gap-3">
              <Volleyball style={{ color: team.color ?? 'currentColor' }} className="h-16 w-16" />
              <Card.Title>{team.name}</Card.Title>
            </Card.Content>
            <Card.Footer className="justify-center gap-1">
              <Button
                variant="outline"
                size="icon"
                aria-label={intl.formatMessage({ id: 'teamCard.view' })}
                onPress={() => navigate(`/app/team/${team.id}`)}
              >
                <Eye />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={intl.formatMessage({ id: 'teamCard.players' })}
                onPress={() => navigate(`/app/team/${team.id}/players`)}
              >
                <Users />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label={intl.formatMessage({ id: 'common.edit' })}
                onPress={() => navigate(`${team.id}/edit`)}
              >
                <Pencil />
              </Button>
            </Card.Footer>
          </Card.Container>
        </Grid.Item>
      )}
    </Grid.Root>
  )
}
