import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Phase } from '../../domain/Phase'
import { PhaseTabs } from './PhaseTabs'

const phases: Phase[] = [
  { id: 'p1', championshipId: 'c1', type: 'GROUP', order: 1, name: 'Phase 1', qualification: { maxRank: 2 } },
  { id: 'p2', championshipId: 'c1', type: 'KNOCKOUT', order: 2, name: 'Phase 2' },
]

const meta = {
  component: PhaseTabs,
  title: 'Championship/PhaseTabs',
  args: {
    phases,
    value: 'p1',
    onValueChange: fn(),
  },
} satisfies Meta<typeof PhaseTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Phase 1 sélectionnée' }

export const ClickPhase: Story = {
  name: 'Cliquer un onglet appelle onValueChange',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /Phase 2/ }))
    expect(args.onValueChange).toHaveBeenCalledWith('p2')
  },
}
