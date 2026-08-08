import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { StepName } from './StepName'

const meta = {
  component: StepName,
  title: 'Championship/Wizard/StepName',
  args: { name: '', onChange: fn() },
} satisfies Meta<typeof StepName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithContext: Story = {
  args: { categoryLabel: 'U13', categoryGenreLabel: 'Féminin', seasonYear: '2026' },
}

export const TypeName: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = await canvas.findByRole('textbox')
    await userEvent.type(input, 'Championnat U13')
    expect(args.onChange).toHaveBeenCalled()
  },
}
