import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Label, Text } from 'react-aria-components'

import { Input } from '../Input/Input'
import { TextField } from './TextField'
import { FieldError } from './FieldError'

const meta = {
  component: TextField,
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <TextField {...args} className="w-64">
      <Label className="text-sm font-medium">Email</Label>
      <Input type="email" placeholder="you@example.com" />
      <Text slot="description" className="text-muted-foreground text-xs">
        Format: user@example.com
      </Text>
    </TextField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox')
    await userEvent.type(input, 'user@example.com')
    expect(input).toHaveValue('user@example.com')
  },
}

export const Required: Story = {
  render: args => (
    <TextField {...args} isRequired className="w-64">
      <Label className="text-sm font-medium">
        Nom d'utilisateur <span aria-hidden>*</span>
      </Label>
      <Input placeholder="john_doe" />
    </TextField>
  ),
}

export const Invalid: Story = {
  render: args => (
    <TextField {...args} isInvalid className="w-64">
      <Label className="text-sm font-medium">Email</Label>
      <Input type="email" placeholder="you@example.com" defaultValue="not-an-email" />
      <FieldError>Format d'email invalide</FieldError>
    </TextField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByText('Format d\'email invalide')).toBeInTheDocument()
    expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Disabled: Story = {
  render: args => (
    <TextField {...args} isDisabled className="w-64">
      <Label className="text-sm font-medium">Email</Label>
      <Input type="email" placeholder="Désactivé" />
    </TextField>
  ),
}

export const Password: Story = {
  render: args => (
    <TextField {...args} className="w-64">
      <Label className="text-sm font-medium">Mot de passe</Label>
      <Input type="password" placeholder="••••••••" />
    </TextField>
  ),
}
