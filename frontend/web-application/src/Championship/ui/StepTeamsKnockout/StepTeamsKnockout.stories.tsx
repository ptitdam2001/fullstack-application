import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Team } from '@Teams/domain/Team'
import { StepTeamsKnockout } from './StepTeamsKnockout'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
]

const meta = {
  component: StepTeamsKnockout,
  title: 'Championship/Wizard/StepTeamsKnockout',
  args: { teams, teamIds: ['t1'], onToggleTeam: fn() },
} satisfies Meta<typeof StepTeamsKnockout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AddTeam: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const addButtons = await canvas.findAllByLabelText(/Add|Ajouter/)
    await userEvent.click(addButtons[0])
    expect(args.onToggleTeam).toHaveBeenCalledWith('t2')
  },
}

export const RemoveTeam: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const removeButton = await canvas.findByLabelText(/Remove|Retirer/)
    await userEvent.click(removeButton)
    expect(args.onToggleTeam).toHaveBeenCalledWith('t1')
  },
}
