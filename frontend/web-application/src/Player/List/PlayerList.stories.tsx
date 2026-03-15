import type { Meta, StoryObj } from '@storybook/react-vite'

import { PlayerList } from './PlayerList'
import { getGetTeamPlayersMockHandler } from '@Sdk/teams/teams.msw'

const meta = {
  component: PlayerList,
  title: 'Player/PlayerList',
  parameters: {
    msw: {
      handlers: {
        players: [getGetTeamPlayersMockHandler()],
      },
    },
  },
} satisfies Meta<typeof PlayerList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    teamId: '1',
  },
}
