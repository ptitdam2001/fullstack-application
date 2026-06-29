import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { ConfirmDeleteAgeCategoryDialog } from './ConfirmDeleteAgeCategoryDialog'

const meta = {
  component: ConfirmDeleteAgeCategoryDialog,
  title: 'AgeCategory/ConfirmDeleteAgeCategoryDialog',
  args: {
    label: 'U13',
    open: true,
    isPending: false,
    onConfirm: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ConfirmDeleteAgeCategoryDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Dialogue de confirmation',
}

export const ClickConfirm: Story = {
  name: 'Cliquer Supprimer appelle onConfirm',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /supprimer/i }))
    expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const ClickCancel: Story = {
  name: 'Cliquer Annuler appelle onOpenChange(false)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /annuler/i }))
    expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

export const Pending: Story = {
  name: 'Bouton désactivé pendant la suppression',
  args: { isPending: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const confirmButton = canvas.getByRole('button', { name: /supprimer/i })
    expect(confirmButton).toBeDisabled()
  },
}
