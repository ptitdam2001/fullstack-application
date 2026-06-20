import type { FeedEvent } from '@Dashboard/domain/Dashboard'
import { Typography } from '@repo/design-system'
import { FormattedDate, FormattedMessage } from 'react-intl'

type Props = { event: FeedEvent }

export const AdminLiveFeederEventLabel = ({ event }: Props) => {
  switch (event.type) {
    case 'ACTIVATION_REQUEST':
      return (
        <div className="flex-col">
          <Typography.Body>
            <FormattedMessage
              id="adminDashboard.feed.event.activationRequest"
              values={{ firstName: event.firstName, lastName: event.lastName }}
            />
          </Typography.Body>
          <Typography.BodySmall color="muted">
            <FormattedDate value={event.date} />
          </Typography.BodySmall>
        </div>
      )
    case 'FORFEIT':
      return <FormattedMessage id="adminDashboard.feed.event.forfeit" />
    case 'MATCH_COMPLETED':
      return <FormattedMessage id="adminDashboard.feed.event.matchCompleted" />
    default:
      return null
  }
}
