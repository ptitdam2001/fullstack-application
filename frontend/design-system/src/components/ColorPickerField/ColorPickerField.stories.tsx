import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { ColorPickerField } from './ColorPickerField'

const meta = {
  component: ColorPickerField,
  decorators: [
    Story => (
      <div className="flex min-h-72 items-start justify-center pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorPickerField>

export default meta

type Story = StoryObj<typeof meta>

const ControlledRender = (args: React.ComponentProps<typeof ColorPickerField>) => {
  const [value, setValue] = useState(args.value ?? '#7f00ff')
  return <ColorPickerField {...args} value={value} onChange={setValue} />
}

export const Default: Story = {
  render: args => <ControlledRender {...args} label="Team color" />,
}

export const Opens: Story = {
  render: args => <ControlledRender {...args} label="Team color" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Team color' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
  },
}

export const ClosesOnEscape: Story = {
  render: args => <ControlledRender {...args} label="Team color" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Team color' }))
    await expect(within(document.body).getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const WithError: Story = {
  args: { label: 'Team color', errorMessage: 'Color is required', value: '#7f00ff' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Color is required')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { label: 'Team color', value: '#7f00ff', isDisabled: true },
}
