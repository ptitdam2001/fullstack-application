import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { UserCheck, AlertTriangle, CheckCircle, Users } from 'lucide-react'
import type { FeedEvent } from '@Dashboard/domain/Dashboard'

const EVENT_CONFIG = {
  ACTIVATION_REQUEST: { icon: <UserCheck className="h-4 w-4 text-amber-500" />, color: 'border-l-amber-400' },
  TEAM_CREATED: { icon: <Users className="h-4 w-4 text-blue-500" />, color: 'border-l-blue-400' },
  FORFEIT: { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, color: 'border-l-destructive' },
  MATCH_COMPLETED: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: 'border-l-green-400' },
} as const

type Props = { event: FeedEvent }

export const AdminLiveFeedEvent = ({ event }: Props) => {
  const config = EVENT_CONFIG[event.type]

  const label = (() => {
    switch (event.type) {
      case 'ACTIVATION_REQUEST':
        return (
          <FormattedMessage
            id="adminDashboard.feed.event.activationRequest"
            values={{ firstName: event.firstName, lastName: event.lastName }}
          />
        )
      case 'FORFEIT':
        return <FormattedMessage id="adminDashboard.feed.event.forfeit" />
      case 'MATCH_COMPLETED':
        return <FormattedMessage id="adminDashboard.feed.event.matchCompleted" />
      default:
        return null
    }
  })()

  return (
    <div className={`bg-card flex items-center gap-3 rounded-md border border-l-4 p-3 ${config.color}`}>
      {config.icon}
      <span className="flex-1 text-sm">{label}</span>
      {event.href && (
        <Link to={event.href} className="text-muted-foreground hover:text-foreground text-xs transition-colors">
          →
        </Link>
      )}
      {event.onAction && (
        <button
          onClick={event.onAction}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-2 py-0.5 text-xs font-medium"
        >
          <FormattedMessage id="adminDashboard.feed.activate" />
        </button>
      )}
    </div>
  )
}
