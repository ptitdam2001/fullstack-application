import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ColorArea } from './ColorArea'

const meta = {
  component: ColorArea,
  decorators: [
    Story => (
      <div className="flex min-h-64 items-start justify-center pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ColorArea>

export default meta

type Story = StoryObj<typeof meta>

const ControlledRender = () => {
  const [value, setValue] = useState('#7f00ff')
  return <ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" value={value} onChange={c => setValue(c.toString('hex'))} />
}

export const Default: Story = {
  render: () => <ControlledRender />,
}

export const Disabled: Story = {
  args: {
    defaultValue: '#7f00ff',
    colorSpace: 'hsb',
    xChannel: 'saturation',
    yChannel: 'brightness',
    isDisabled: true,
  },
}
