import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent } from '@/components/ui/card'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { useGetTeam } from '@Sdk/team/team'
import { BaseTeamType } from '@Teams/types'

type TeamDetailProps = BaseTeamType

export const TeamDetail = ({ teamId }: TeamDetailProps) => {
  const { data: team, isLoading } = useGetTeam(teamId)

  return (
    <Card className="w-full h-full">
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <CardContent>
            <h5>{team?.name}</h5>
          </CardContent>
          <CardAction>
            <Button>Learn More</Button>
          </CardAction>
        </>
      )}
    </Card>
  )
}
