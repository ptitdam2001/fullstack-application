'use client'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { TeamCard } from './TeamCard'
import { getGetTeamMockHandler } from '@Sdk/team/team.msw'

const meta = {
  component: TeamCard,
  title: 'Teams/TeamCard',
  tags: ['autodocs'],
  parameters: {
    msw: {
      handlers: {
        team: [getGetTeamMockHandler()],
      },
    },
  },
} satisfies Meta<typeof TeamCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    teamId: '1',
  },
}
