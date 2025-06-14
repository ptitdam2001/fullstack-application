import { FunctionComponent } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, Star } from 'lucide-react'

type UserCardProps = {
  user: {
    login: string
  }
}

export const UserCard: FunctionComponent<UserCardProps> = ({ user }) => (
  <Card className="max-w-80">
    <CardHeader>
      <CardTitle>
        <Avatar className="bg-red-500" aria-label="recipe">
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
        {user.login}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-justify" style={{ color: 'text.secondary' }}>
        This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of
        frozen peas along with the mussels, if you like.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="icon" aria-label="add to favorites">
        <Star />
      </Button>
      <Button variant="outline" size="icon" aria-label="share">
        <Share2 />
      </Button>
    </CardFooter>
  </Card>
)
