import { AuthProvider } from '@Auth/application/AuthProvider'
import { useRefereeDashboard } from '@Dashboard/application/useRefereeDashboard'
import { FormattedMessage } from 'react-intl'
import { RefereeUrgentMatches } from './RefereeUrgentMatches'
import { RefereeUpcomingMatches } from './RefereeUpcomingMatches'

export const RefereeTab = () => {
  const { user } = AuthProvider.useAuthValue()
  const { urgentMatches, upcomingMatches, teamNames } = useRefereeDashboard(user?.id ?? '')

  if (urgentMatches.length === 0 && upcomingMatches.length === 0) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">
          <FormattedMessage id="refereeDashboard.noMatches" />
        </p>
      </section>
    )
  }

  return (
    <section className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <RefereeUrgentMatches matches={urgentMatches} teamNames={teamNames} />
      <RefereeUpcomingMatches matches={upcomingMatches} teamNames={teamNames} />
    </section>
  )
}
