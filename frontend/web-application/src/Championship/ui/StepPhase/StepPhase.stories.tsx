import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { PhaseType } from '../../domain/Phase'
import { StepPhase } from './StepPhase'

const meta = {
  component: StepPhase,
  title: 'Championship/Wizard/StepPhase',
  args: { phaseType: null, onSelect: fn() },
} satisfies Meta<typeof StepPhase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithGroupSelected: Story = {
  args: { phaseType: PhaseType.GROUP },
}

export const WithKnockoutSelected: Story = {
  args: { phaseType: PhaseType.KNOCKOUT },
}

export const SelectKnockout: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const card = await canvas.findByRole('button', { name: /Knockout|Éliminatoires/ })
    await userEvent.click(card)
    expect(args.onSelect).toHaveBeenCalledWith(PhaseType.KNOCKOUT)
  },
}
