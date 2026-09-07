import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Group } from '../../domain/Group'
import { PoolSelector } from './PoolSelector'

const pools: Group[] = [
  { id: 'g1', phaseId: 'p1', name: 'Poule A', matchMode: 'HOME_AND_AWAY', teamIds: ['t1', 't2'] },
  { id: 'g2', phaseId: 'p1', name: 'Poule B', matchMode: 'SINGLE', teamIds: ['t3', 't4'] },
]

const meta = {
  component: PoolSelector,
  title: 'Championship/PoolSelector',
  args: { pools, value: 'g1', onValueChange: fn() },
} satisfies Meta<typeof PoolSelector>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Poule A sélectionnée' }

export const ClickPool: Story = {
  name: 'Cliquer une poule appelle onValueChange',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: 'Poule B' }))
    expect(args.onValueChange).toHaveBeenCalledWith('g2')
  },
}

export const SinglePool: Story = {
  name: "Une seule poule (rien n'est affiché)",
  args: { pools: [pools[0]] },
}
