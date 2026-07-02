import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import { ColorSwatch } from './ColorSwatch'

const meta = {
  component: ColorSwatch,
} satisfies Meta<typeof ColorSwatch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { color: '#7f00ff' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img')).toBeInTheDocument()
  },
}

export const WithColorName: Story = {
  args: { color: '#f00', colorName: 'Fire truck red' },
}

export const WithAriaLabel: Story = {
  args: { color: '#f00', 'aria-label': 'Background color' },
}
