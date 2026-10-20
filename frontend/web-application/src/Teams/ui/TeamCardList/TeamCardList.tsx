import { Button, Card, List } from '@repo/design-system'
import { Eye, Pencil, Users, Volleyball } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useIntl } from '@I18n/translation'
import type { Team } from '../../domain/Team'

type Props = { teams: Team[] }

export const TeamCardList = ({ teams }: Props) => {
  const navigate = useNavigate()
  const intl = useIntl()
  return (
    <List.Root
      aria-label={intl.formatMessage({ id: 'teams.title' })}
      items={teams}
      variant="ghost"
      layoutOptions={{ rowHeight: 84, gap: 2 }}
    >
      {team => (
        <List.Item id={team.id} textValue={team.name} className="rounded-none">
          <Card.Container className="w-full flex-row items-center gap-0 overflow-hidden py-4">
            <div className="shrink-0 px-6">
              <Volleyball style={{ color: team.color ?? 'currentColor' }} className="h-10 w-10" />
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <Card.Title className="truncate">{team.name}</Card.Title>
              {(team.areas ?? []).length > 0 && (
                <p className="text-muted-foreground mt-1 truncate text-sm">
                  {(team.areas ?? []).map(a => a.city).join(' · ')}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1 px-6">
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
            </div>
          </Card.Container>
        </List.Item>
      )}
    </List.Root>
  )
}
