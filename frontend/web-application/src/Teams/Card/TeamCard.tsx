import { Button, Card } from '@repo/design-system'
import { Team } from '@Sdk/model'

type TeamCardRenderProps = {
  team: Team
}

export const TeamCard = ({ team }: TeamCardRenderProps) => (
  <Card.Container className="py-2 gap-1.5">
    <Card.Title className="text-lg px-2">{team.name}</Card.Title>
    <Card.Content></Card.Content>
    <Card.Action>
      <Button>Learn More</Button>
    </Card.Action>
  </Card.Container>
)
