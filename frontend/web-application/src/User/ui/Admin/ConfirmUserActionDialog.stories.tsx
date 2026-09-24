import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { ConfirmUserActionDialog } from './ConfirmUserActionDialog'

const meta = {
  component: ConfirmUserActionDialog,
  title: 'User/ConfirmUserActionDialog',
  args: {
    action: 'delete',
    userName: 'Jane Doe',
    open: true,
    isPending: false,
    onConfirm: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof ConfirmUserActionDialog>

export default meta
type Story = StoryObj<typeof meta>

// The dialog renders in a portal, outside the canvas
const body = () => within(document.body)

export const Delete: Story = {
  name: 'Supprimer — confirmer appelle onConfirm',
  play: async ({ args }) => {
    await expect(await body().findByText(/jane doe/i)).toBeInTheDocument()
    await userEvent.click(body().getByRole('button', { name: /^(delete|supprimer)$/i }))
    await expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const Activate: Story = {
  name: 'Activer — confirmer appelle onConfirm',
  args: { action: 'activate' },
  play: async ({ args }) => {
    await userEvent.click(await body().findByRole('button', { name: /^(activate|activer)$/i }))
    await expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const Unblock: Story = {
  name: 'Débloquer — confirmer appelle onConfirm',
  args: { action: 'unblock' },
  play: async ({ args }) => {
    await userEvent.click(await body().findByRole('button', { name: /^(unblock|débloquer)$/i }))
    await expect(args.onConfirm).toHaveBeenCalled()
  },
}

export const Cancel: Story = {
  name: 'Annuler appelle onOpenChange(false)',
  play: async ({ args }) => {
    await userEvent.click(await body().findByRole('button', { name: /cancel|annuler/i }))
    await expect(args.onOpenChange).toHaveBeenCalledWith(false)
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

export const Pending: Story = {
  name: 'Bouton de confirmation désactivé pendant l’action',
  args: { isPending: true },
  play: async () => {
    await expect(await body().findByRole('button', { name: /delete|supprimer/i })).toBeDisabled()
  },
}
