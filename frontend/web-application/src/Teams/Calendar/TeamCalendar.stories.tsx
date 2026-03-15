import type { Meta, StoryObj } from '@storybook/react-vite'

import { TeamCalendar } from './TeamCalendar'
import { getGetTeamCalendarMockHandler } from '@Sdk/teams/teams.msw'

const meta = {
  component: TeamCalendar,
  title: 'Teams/TeamCalendar',
  parameters: {
    msw: {
      handlers: {
        teamCalendar: [getGetTeamCalendarMockHandler()],
      },
    },
  },
} satisfies Meta<typeof TeamCalendar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    teamId: '1',
  },
}
