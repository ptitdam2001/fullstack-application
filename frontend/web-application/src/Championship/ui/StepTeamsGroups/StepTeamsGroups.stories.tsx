import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Team } from '@Teams/domain/Team'
import { MatchMode } from '../../domain/Group'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'
import { StepTeamsGroups } from './StepTeamsGroups'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
]

const groups: ChampionshipWizardGroup[] = [
  { id: 'g1', name: 'Poule A', teamIds: ['t1'], matchMode: MatchMode.SINGLE, generated: false },
  { id: 'g2', name: 'Poule B', teamIds: [], matchMode: MatchMode.SINGLE, generated: false },
]

const meta = {
  component: StepTeamsGroups,
  title: 'Championship/Wizard/StepTeamsGroups',
  args: {
    teams,
    groups,
    onAddGroup: fn(),
    onRemoveGroup: fn(),
    onRenameGroup: fn(),
    onAssignTeam: fn(),
  },
} satisfies Meta<typeof StepTeamsGroups>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AssignTeamViaMenu: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await canvas.findByText('Bron Handball')
    const assignButtons = canvas.getAllByLabelText(/Assign to a pool|Assigner à une poule/)
    await userEvent.click(assignButtons[0])
    const target = await canvas.findByText('Poule B')
    await userEvent.click(target)
    expect(args.onAssignTeam).toHaveBeenCalledWith('t2', 'g2')
  },
}

export const UnassignTeam: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const unassignButton = await canvas.findByLabelText(/Unassign|Retirer/)
    await userEvent.click(unassignButton)
    expect(args.onAssignTeam).toHaveBeenCalledWith('t1', null)
  },
}

export const AddGroup: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const addButton = await canvas.findByText(/Add a pool|Ajouter une poule/)
    await userEvent.click(addButton)
    expect(args.onAddGroup).toHaveBeenCalled()
  },
}
