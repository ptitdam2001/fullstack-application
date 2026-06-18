import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect } from 'storybook/test'
import { PasswordInput } from './PasswordInput'

const meta = {
  component: PasswordInput,
  parameters: { layout: 'centered' },
  args: { placeholder: '••••••••' },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'my-secret-password' },
}

export const CustomLabels: Story = {
  args: {
    showPasswordLabel: 'Afficher le mot de passe',
    hidePasswordLabel: 'Masquer le mot de passe',
  },
}

export const ToggleVisibility: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole('button', { name: 'Show password' })
    const input = canvas.getByPlaceholderText('••••••••')

    await expect(input).toHaveAttribute('type', 'password')

    await userEvent.click(toggle)
    await expect(input).toHaveAttribute('type', 'text')
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }))
    await expect(input).toHaveAttribute('type', 'password')
  },
}
