import { FormattedMessage } from 'react-intl'
import type { FeedEvent } from '@Dashboard/domain/Dashboard'
import { AdminLiveFeedEvent } from './AdminLiveFeedEvent'

type Props = { events: FeedEvent[] }

export const AdminLiveFeed = ({ events }: Props) => (
  <div className="bg-card rounded-lg border p-4">
    <h3 className="mb-3 text-sm font-semibold">
      <FormattedMessage id="adminDashboard.feed.title" />
    </h3>
    {events.length === 0 ? (
      <p className="text-muted-foreground text-sm">
        <FormattedMessage id="adminDashboard.feed.empty" />
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {events.map(event => (
          <AdminLiveFeedEvent key={event.id} event={event} />
        ))}
      </div>
    )}
  </div>
)
