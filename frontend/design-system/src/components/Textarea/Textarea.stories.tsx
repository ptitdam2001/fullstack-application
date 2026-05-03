import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Textarea } from './Textarea'
import { TextField } from '../TextField/TextField'
import { Label } from '../Label/Label'
import { FieldError } from '../TextField/FieldError'

const meta = {
  component: Textarea,
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Saisir des notes...', className: 'w-80' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const textarea = canvas.getByRole('textbox')
    await userEvent.click(textarea)
    expect(textarea).toHaveFocus()
    await userEvent.type(textarea, 'Commentaire de match')
    expect(textarea).toHaveValue('Commentaire de match')
  },
}

export const WithTextField: Story = {
  render: () => (
    <TextField className="w-80">
      <Label>Notes de match</Label>
      <Textarea placeholder="Décrire le déroulement du match..." rows={4} />
    </TextField>
  ),
}

export const WithValidation: Story = {
  render: () => (
    <TextField isInvalid className="w-80">
      <Label>Description</Label>
      <Textarea placeholder="Champ obligatoire" />
      <FieldError>Ce champ est requis.</FieldError>
    </TextField>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    expect(canvas.getByText('Ce champ est requis.')).toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Champ désactivé',
    isDisabled: true,
    className: 'w-80',
  },
}

export const WithValue: Story = {
  args: {
    defaultValue: 'Match disputé en conditions difficiles.\nScore final : 3-1.',
    className: 'w-80',
    rows: 4,
  },
}
