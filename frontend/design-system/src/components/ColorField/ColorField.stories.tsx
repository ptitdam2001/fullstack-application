import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { ColorField } from './ColorField'

const meta = {
  component: ColorField,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Brand color', placeholder: 'Enter a color' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Brand color' })
    await userEvent.type(input, '#7f00ff')
    await expect(input).toHaveValue('#7F00FF')
  },
}

export const WithError: Story = {
  args: { label: 'Brand color', errorMessage: 'Enter a valid hex color', defaultValue: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Enter a valid hex color')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { label: 'Brand color', defaultValue: '#7f00ff', isDisabled: true },
}
