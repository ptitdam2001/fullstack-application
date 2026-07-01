import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { TextInputField } from './TextInputField'

const meta = {
  component: TextInputField,
  parameters: { layout: 'centered' },
  decorators: [
    Story => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextInputField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Username', placeholder: 'Enter username' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Username' })
    await userEvent.type(input, 'johndoe')
    await expect(input).toHaveValue('johndoe')
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    isInvalid: true,
    errorMessage: 'Invalid email address',
    placeholder: 'you@example.com',
    defaultValue: 'not-an-email',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Invalid email address')).toBeInTheDocument()
    await expect(canvas.getByRole('textbox', { name: /email/i })).toHaveAttribute('aria-invalid', 'true')
  },
}

export const ErrorMessageOnly: Story = {
  args: {
    label: 'Name',
    errorMessage: 'Name is required',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Name is required')).toBeInTheDocument()
  },
}

export const Required: Story = {
  args: { label: 'Full name', isRequired: true, placeholder: 'Jane Smith' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('textbox', { name: /full name/i })).toHaveAttribute('aria-required', 'true')
    await expect(canvas.getByText('*')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { label: 'Read-only field', defaultValue: 'Locked value', isDisabled: true },
}

export const TypeEmail: Story = {
  args: { label: 'Email address', type: 'email', placeholder: 'you@example.com' },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const tooLong = value.length > 10
    return (
      <TextInputField
        label="Short note"
        value={value}
        onChange={setValue}
        placeholder="Max 10 chars"
        isInvalid={tooLong}
        errorMessage={tooLong ? 'Maximum 10 characters' : undefined}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: /short note/i })
    await userEvent.type(input, 'hello world!')
    await expect(canvas.getByText('Maximum 10 characters')).toBeInTheDocument()
  },
}

export const NoLabel: Story = {
  args: { 'aria-label': 'Search', placeholder: 'Search…' },
}
