import type { Meta, StoryObj } from '@storybook/react-vite'

import { TeamForm } from './TeamForm'

const meta = {
  component: TeamForm,
  title: 'Teams/TeamForm',
  tags: ['autodocs'],
} satisfies Meta<typeof TeamForm>

export default meta

type Story = StoryObj<typeof meta>

export const Create: Story = {
  args: {},
}

export const Edit: Story = {
  args: {
    teamId: '1',
    defaultValues: {
      name: 'Awesome Team',
      color: '#4455aa',
    },
  },
}
