import { useGetTeamCalendar } from '@Sdk/teams/teams'
import { BaseTeamType } from '@Teams/types'
import { FunctionComponent } from 'react'

type TeamCalendarProps = BaseTeamType

export const TeamCalendar: FunctionComponent<TeamCalendarProps> = ({ teamId }) => {
  const { data, isLoading } = useGetTeamCalendar(teamId)

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex-grow rounded-md shadow-md p-4">
        <h2 className="text-lg font-semibold">Team Calendar</h2>
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 h-48 rounded-md"></div>
        ) : (
          <ul className="list-disc pl-5">
            {data?.map(event => (
              <li key={event.id} className="py-1">
                {event.date}: {event.id}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
