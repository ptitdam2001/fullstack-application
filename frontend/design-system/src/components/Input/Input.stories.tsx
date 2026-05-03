import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Input } from './Input'

const meta = {
  component: Input,
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.click(input)
    expect(input).toHaveFocus()
    await userEvent.type(input, 'Hello world')
    expect(input).toHaveValue('Hello world')
  },
}

export const WithType: Story = {
  args: { type: 'email', placeholder: 'email@example.com' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}

export const WithValue: Story = {
  args: { defaultValue: 'Prefilled value' },
}

export const Invalid: Story = {
  args: { placeholder: 'Invalid input', 'aria-invalid': true },
}

export const FocusVisible: Story = {
  args: { placeholder: 'Tab to focus me' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    expect(canvas.getByRole('textbox')).toHaveFocus()
  },
}
