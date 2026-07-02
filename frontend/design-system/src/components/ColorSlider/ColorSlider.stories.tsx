import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ColorSlider } from './ColorSlider'

const meta = {
  component: ColorSlider,
  decorators: [
    Story => (
      <div className="flex min-h-24 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorSlider>

export default meta

type Story = StoryObj<typeof meta>

const ControlledRender = () => {
  const [value, setValue] = useState('hsl(50, 100%, 50%)')
  return <ColorSlider label="Hue" channel="hue" value={value} onChange={c => setValue(c.toString('hsl'))} />
}

export const Default: Story = {
  render: () => <ControlledRender />,
}

export const Vertical: Story = {
  args: { label: 'Hue', channel: 'hue', defaultValue: 'hsl(50, 100%, 50%)', orientation: 'vertical' },
}

export const Disabled: Story = {
  args: { label: 'Hue', channel: 'hue', defaultValue: 'hsl(50, 100%, 50%)', isDisabled: true },
}
