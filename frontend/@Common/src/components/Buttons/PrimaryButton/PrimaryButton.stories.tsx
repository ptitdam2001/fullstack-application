import type { Meta, StoryObj } from '@storybook/react-vite'
import { PrimaryButton } from './PrimaryButton'
import { Close } from '@Components/Icon'
import { fn } from 'storybook/test'

const meta = {
  title: 'Common/Buttons/PrimaryButton',
  component: PrimaryButton,
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
} satisfies Meta<typeof PrimaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Hello World!',
  },
}

export const TextWithIcon: Story = {
  args: {
    label: 'Hello World!',
    icon: <Close />,
  },
}

export const DisabledWithIcon: Story = {
  args: {
    label: 'Hello World!',
    icon: <Close />,
    disabled: true,
  },
}
