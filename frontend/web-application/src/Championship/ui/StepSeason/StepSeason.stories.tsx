import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Season } from '@Season/domain/Season'
import { StepSeason } from './StepSeason'

const seasons: Season[] = [
  { id: 's1', label: '2025-2026', startDate: '2025-09-01', endDate: '2026-06-30', createdAt: '', updatedAt: '' },
  { id: 's2', label: '2026-2027', startDate: null, endDate: null, createdAt: '', updatedAt: '' },
]

const meta = {
  component: StepSeason,
  title: 'Championship/Wizard/StepSeason',
  args: { seasons, selectedId: null, onSelect: fn() },
} satisfies Meta<typeof StepSeason>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: { selectedId: 's1' },
}

export const Empty: Story = {
  args: { seasons: [] },
}

export const SelectSeason: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const radios = await canvas.findAllByRole('radio')
    await userEvent.click(radios[1])
    expect(args.onSelect).toHaveBeenCalledWith('s2')
  },
}
