import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, expect } from 'storybook/test'
import type { Team } from '@Teams/domain/Team'
import { StepConfigKnockout } from './StepConfigKnockout'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
  { id: 't4', name: 'Vénissieux HB', color: '#2ba05a', ageCategoryId: 'c3' },
  { id: 't5', name: 'Caluire HB', color: '#c9a227', ageCategoryId: 'c3' },
]

const meta = {
  component: StepConfigKnockout,
  title: 'Championship/Wizard/StepConfigKnockout',
  args: { teams, teamIds: ['t1', 't2', 't3', 't4'] },
} satisfies Meta<typeof StepConfigKnockout>

export default meta
type Story = StoryObj<typeof meta>

export const FourTeams: Story = {}

export const OddTeamsWithBye: Story = {
  args: { teamIds: ['t1', 't2', 't3', 't4', 't5'] },
}

export const NotEnoughTeams: Story = {
  args: { teamIds: ['t1'] },
}

export const RendersRoundLabels: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await canvas.findByText(/Semi-final|1\/2 finale/)
    expect(canvas.getByText(/Final$|Finale$/)).toBeInTheDocument()
  },
}
