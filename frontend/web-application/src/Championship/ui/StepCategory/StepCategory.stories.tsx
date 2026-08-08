import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { AgeCategory } from '@AgeCategory/domain/AgeCategory'
import { StepCategory } from './StepCategory'

const categories: AgeCategory[] = [
  { id: 'c1', label: 'U9', genre: 'MIXED' as const, createdAt: '', updatedAt: '' },
  { id: 'c2', label: 'U13', genre: 'FEMALE' as const, createdAt: '', updatedAt: '' },
  { id: 'c3', label: 'U15', genre: 'MALE' as const, createdAt: '', updatedAt: '' },
]

const meta = {
  component: StepCategory,
  title: 'Championship/Wizard/StepCategory',
  args: { categories, selectedId: null, onSelect: fn() },
} satisfies Meta<typeof StepCategory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSelection: Story = {
  args: { selectedId: 'c2' },
}

export const Empty: Story = {
  args: { categories: [] },
}

export const SelectCategory: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const chip = await canvas.findByRole('button', { name: /U15/ })
    await userEvent.click(chip)
    expect(args.onSelect).toHaveBeenCalledWith('c3')
  },
}
