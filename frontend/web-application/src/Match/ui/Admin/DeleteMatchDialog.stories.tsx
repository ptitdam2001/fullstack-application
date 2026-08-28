import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import { MatchStatus } from '../../domain/Match'
import type { Match } from '../../domain/Match'
import { DeleteMatchDialog } from './DeleteMatchDialog'

const match: Match = {
  id: 'match-1',
  area: { id: 'area-1', name: 'Salle A', address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  homeTeam: { id: 'team-1', name: 'Lions', color: '#ff0000' },
  awayTeam: { id: 'team-2', name: 'Tigers', color: '#0000ff' },
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
}

const meta = {
  component: DeleteMatchDialog,
  title: 'Match/Admin/DeleteMatchDialog',
  args: {
    match,
    open: true,
    isPending: false,
    onConfirm: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof DeleteMatchDialog>

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
  name: 'Boutons désactivés pendant la suppression',
  args: { isPending: true },
  play: async () => {
    const confirmButton = await within(document.body).findByRole('button', { name: /delete|supprimer/i })
    expect(confirmButton).toBeDisabled()
  },
}
