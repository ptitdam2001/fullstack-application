import { Button, Card } from '@repo/design-system'
import { type Team } from '@Sdk/model'

type TeamCardRenderProps = {
  team: Team
}

export const TeamCard = ({ team }: TeamCardRenderProps) => (
  <Card.Container className="gap-1.5 py-2">
    <Card.Title className="px-2 text-lg">{team.name}</Card.Title>
    <Card.Content></Card.Content>
    <Card.Action>
      <Button>Learn More</Button>
    </Card.Action>
  </Card.Container>
)
