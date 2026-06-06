import { Badge, Button, Card } from '@repo/design-system'
import { FormattedMessage, useIntl } from '@I18n/translation'
import { useNavigate } from 'react-router'
import { type Team } from '../../domain/Team'
import { TeamCardVenue } from './TeamCardVenue'

type TeamWithAgeCategory = Team & { ageCategory?: string }

type Props = { team: TeamWithAgeCategory }

export const TeamCard = ({ team }: Props) => {
  const navigate = useNavigate()
  const intl = useIntl()

  return (
    <Card.Container className="gap-2 py-3">
      <Card.Header className="flex-row items-center gap-2 px-3">
        {team.color && (
          <span
            className="inline-block h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: team.color }}
            aria-hidden="true"
          />
        )}
        <Card.Title className="text-base font-bold">{team.name}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-2 px-3">
        {team.ageCategory && (
          <Badge variant="secondary" aria-label={intl.formatMessage({ id: 'teamCard.ageCategory' })}>
            {team.ageCategory}
          </Badge>
        )}
        <TeamCardVenue areas={team.areas} />
      </Card.Content>
      <Card.Action className="px-3">
        <Button variant="outline" size="sm" onPress={() => navigate(`/app/team/${team.id}`)}>
          <FormattedMessage id="teamCard.view" />
        </Button>
      </Card.Action>
    </Card.Container>
  )
}
