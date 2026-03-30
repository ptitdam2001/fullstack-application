'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { RequestedTeamCard } from './RequestedTeamCard'
import { getGetTeamMockHandler } from '@Sdk/team/team.msw'

const meta = {
  component: RequestedTeamCard,
  title: 'Teams/TeamCard',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: {
        team: [getGetTeamMockHandler()],
      },
    },
  },
} satisfies Meta<typeof RequestedTeamCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    teamId: '1',
  },
}
