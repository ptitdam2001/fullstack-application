import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextInput } from './TextInput'
import { CloseEye } from '@Components/Icon'

const meta = {
  title: 'Common/Input/TextInput',
  component: TextInput,
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
} satisfies Meta<typeof TextInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'My text',
  },
}

export const WithPreElement: Story = {
  args: {
    label: 'My text',
    value: 'Hello World!',
    preElement: <CloseEye className="text-black h-5 w-5" />,
  },
}

export const WithPreElementAndError: Story = {
  args: {
    label: 'My text',
    value: 'Hello World!',
    preElement: <CloseEye className="text-black h-5 w-5" />,
    error: 'My error message',
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
    preElement: <CloseEye className="text-black h-5 w-5" />,
  },
}
