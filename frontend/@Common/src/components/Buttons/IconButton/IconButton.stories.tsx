import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'
import { Close } from '@Components/Icon'
import { fn } from '@storybook/test'

const meta = {
  title: 'Common/Buttons/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className="p-2">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: {
      actions: 'click',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <Close />,
  },
}

export const WithBorder: Story = {
  args: {
    icon: <Close />,
    withBorder: true,
  },
}

export const SmallSize: Story = {
  args: {
    icon: <Close />,
    size: 'small',
  },
}

export const LargeSize: Story = {
  args: {
    icon: <Close />,
    size: 'large',
  },
}

export const DisabledIcon: Story = {
  args: {
    icon: <Close />,
    disabled: true,
  },
}
