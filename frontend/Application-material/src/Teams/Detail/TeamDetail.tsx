import { Button, Card, CardActions, CardContent, LinearProgress, Typography } from '@mui/material'
import { useGetTeam } from '@Sdk/sdk'

type TeamDetailProps = {
  teamId: string
}

export const TeamDetail = ({ teamId }: TeamDetailProps) => {
  const { data: team, isLoading } = useGetTeam(teamId)

  return (
    <Card variant="outlined" className="w-full h-full">
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {team?.name}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <Button size="small">Learn More</Button>
          </CardActions>
        </>
      )}
    </Card>
  )
}
