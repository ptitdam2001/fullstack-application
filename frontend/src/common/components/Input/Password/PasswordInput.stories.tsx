import type { Meta, StoryObj } from '@storybook/react'
import PasswordInput from './PasswordInput'

const meta = {
  title: 'Common/Input/PasswordInput',
  component: PasswordInput,
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
    onChange: {
      actions: 'onChange',
    },
  },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'My text',
  },
}

export const Disabled: Story = {
  args: {
    label: 'My text',
    disabled: true,
    value: 'Hello World!',
  },
}

export const WithError: Story = {
  args: {
    label: 'My text',
    error: 'My error message',
    value: 'Hello World!',
  },
}

export const Mandatory: Story = {
  args: {
    label: 'My text',
    error: 'My error message',
    value: 'Hello World!',
    required: true,
  },
}

export const Borderless: Story = {
  args: {
    label: 'My text',
    error: 'My error message',
    value: 'Hello World!',
    required: true,
    borderless: true,
  },
}
