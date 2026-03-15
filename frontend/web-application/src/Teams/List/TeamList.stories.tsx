import type { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router'

import { TeamList } from './TeamList'
import { getCountTeamsMockHandler, getGetTeamsMockHandler } from '@Sdk/teams/teams.msw'

const meta = {
  component: TeamList,
  title: 'Teams/TeamList',
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: {
        team: [getGetTeamsMockHandler()],
        countTeam: [getCountTeamsMockHandler()],
      },
    },
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { teamId: '42' },
      },
      routing: { path: '/teams/:teamId' },
    }),
  },
} satisfies Meta<typeof TeamList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
