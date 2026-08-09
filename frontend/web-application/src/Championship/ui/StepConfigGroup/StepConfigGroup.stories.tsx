import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Team } from '@Teams/domain/Team'
import { MatchMode } from '../../domain/Group'
import type { ChampionshipWizardGroup } from '../../application/useChampionshipWizard'
import { StepConfigGroup } from './StepConfigGroup'

const teams: Team[] = [
  { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a', ageCategoryId: 'c3' },
  { id: 't2', name: 'Lyon HB Club', color: '#2f6fed', ageCategoryId: 'c3' },
  { id: 't3', name: 'Bron Handball', color: '#1a1a1a', ageCategoryId: 'c3' },
]

const groups: ChampionshipWizardGroup[] = [
  { id: 'g1', name: 'Poule A', teamIds: ['t1', 't2', 't3'], matchMode: MatchMode.SINGLE, generated: true },
  { id: 'g2', name: 'Poule B', teamIds: [], matchMode: MatchMode.SINGLE, generated: false },
]

const meta = {
  component: StepConfigGroup,
  title: 'Championship/Wizard/StepConfigGroup',
  args: {
    teams,
    groups,
    points: { win: 3, draw: 2, loss: 1, forfeit: 0 },
    maxRank: 2,
    onSetMatchMode: fn(),
    onGenerate: fn(),
    onStepPoints: fn(),
    onMaxRankChange: fn(),
  },
} satisfies Meta<typeof StepConfigGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const GenerateMatches: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const generateButtons = await canvas.findAllByText(/Generate matches|Générer les oppositions/)
    await userEvent.click(generateButtons[0])
    expect(args.onGenerate).toHaveBeenCalledWith('g1')
  },
}

export const IncrementWinPoints: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const incrementButtons = await canvas.findAllByLabelText(/Increase$|Augmenter$/)
    await userEvent.click(incrementButtons[0])
    expect(args.onStepPoints).toHaveBeenCalledWith('win', 1)
  },
}

export const IncrementQualification: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = await canvas.findByLabelText(/Increase qualifying position|Augmenter la position qualificative/)
    await userEvent.click(button)
    expect(args.onMaxRankChange).toHaveBeenCalledWith(3)
  },
}
