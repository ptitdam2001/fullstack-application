import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardTitle } from '@/components/ui/card'
import { LinearProgress } from '@Common/Loading/LinearProgress'
import { useGetTeam } from '@Sdk/team/team'
import { TeamCalendar } from '@Teams/TeamCalendar/TeamCalendar'
import { BaseTeamType } from '@Teams/types'
import { className as cn } from '@Common/utils/className'

type TeamDetailProps = BaseTeamType & {
  className?: string
}

export const TeamDetail = ({ teamId, className }: TeamDetailProps) => {
  const { data: team, isLoading } = useGetTeam(teamId)

  return (
    <section className={cn('flex flex-col gap-2', className)}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Card className="py-2 gap-1.5">
          <CardTitle className="text-lg px-2">{team?.name}</CardTitle>
          <CardContent></CardContent>
          <CardAction>
            <Button>Learn More</Button>
          </CardAction>
        </Card>
      )}

      <Card className="grow py-2 gap-1.5 h-72">
        <CardTitle className="text-lg px-2">Calendar</CardTitle>

        <CardContent className="overflow-auto p-2">
          <TeamCalendar teamId={teamId} />
        </CardContent>
      </Card>
    </section>
  )
}
