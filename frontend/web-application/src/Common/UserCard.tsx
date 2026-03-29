import { FunctionComponent } from 'react'
import { Button } from '@repo/design-system'
import { Avatar, AvatarFallback } from '@repo/design-system'
import { Card } from '@repo/design-system'
import { Share2, Star } from 'lucide-react'

type UserCardProps = {
  user: {
    login: string
  }
}

export const UserCard: FunctionComponent<UserCardProps> = ({ user }) => (
  <Card.Container className="max-w-80">
    <Card.Header>
      <Card.Title>
        <Avatar className="bg-red-500" aria-label="recipe">
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
        {user.login}
      </Card.Title>
    </Card.Header>
    <Card.Content>
      <p className="text-justify" style={{ color: 'text.secondary' }}>
        This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of
        frozen peas along with the mussels, if you like.
      </p>
    </Card.Content>
    <Card.Footer>
      <Button variant="outline" size="icon" aria-label="add to favorites">
        <Star />
      </Button>
      <Button variant="outline" size="icon" aria-label="share">
        <Share2 />
      </Button>
    </Card.Footer>
  </Card.Container>
)
