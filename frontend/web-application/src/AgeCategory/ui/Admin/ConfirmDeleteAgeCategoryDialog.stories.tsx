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
  play: async ({ args }) => {
    const confirmButton = await within(document.body).findByRole('button', { name: /delete|supprimer/i })
    await userEvent.click(confirmButton)
    expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const ClickCancel: Story = {
  name: 'Cliquer Annuler appelle onOpenChange(false)',
  play: async ({ args }) => {
    const cancelButton = await within(document.body).findByRole('button', { name: /cancel|annuler/i })
    await userEvent.click(cancelButton)
    expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

export const Pending: Story = {
  name: 'Bouton désactivé pendant la suppression',
  args: { isPending: true },
  play: async () => {
    const confirmButton = await within(document.body).findByRole('button', { name: /delete|supprimer/i })
    expect(confirmButton).toBeDisabled()
  },
}
