import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { getEditMatchMockHandler } from '@Sdk/match/match.msw'
import { MatchStatus } from '../../domain/Match'
import type { Match } from '../../domain/Match'
import { ScoreEntryDialog } from './ScoreEntryDialog'

const baseMatch: Match = {
  id: 'match-1',
  area: { id: 'area-1', name: 'Salle A', address: '1 rue du Stade', city: 'Lyon', longitude: 4.83, latitude: 45.75 },
  homeTeamId: 'team-1',
  awayTeamId: 'team-2',
  status: MatchStatus.SCHEDULED,
  scheduledAt: '2026-09-01T18:00:00.000Z',
  championshipName: 'Championnat U13',
  stageName: 'Poule A',
  homeTeam: { id: 'team-1', name: 'Les Aigles', color: '#ef4444' },
  awayTeam: { id: 'team-2', name: 'Les Loups', color: '#3b82f6' },
}

const meta = {
  component: ScoreEntryDialog,
  title: 'Match/Admin/ScoreEntryDialog',
  args: {
    match: baseMatch,
    open: true,
    onOpenChange: fn(),
    onFinish: fn(),
  },
  parameters: {
    msw: { handlers: [getEditMatchMockHandler()] },
  },
} satisfies Meta<typeof ScoreEntryDialog>

export default meta
type Story = StoryObj<typeof meta>

export const EnterScore: Story = {
  name: 'Match à venir — saisie',
}

export const EditScore: Story = {
  name: 'Match joué — modification',
  args: {
    match: { ...baseMatch, status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 },
  },
}

export const ClickCancel: Story = {
  name: 'Annuler appelle onOpenChange(false)',
  play: async ({ args }) => {
    const body = within(document.body)
    await userEvent.click(await body.findByRole('button', { name: /annuler|cancel/i }))
    expect(args.onOpenChange).toHaveBeenCalledWith(false)
  },
}

export const IncrementAndSubmit: Story = {
  name: 'Incrémenter puis valider appelle onFinish',
  play: async ({ args }) => {
    const body = within(document.body)
    const homeInput = await body.findByRole('textbox', { name: /buts domicile|home goals/i })
    const homeField = homeInput.closest('[data-slot="number-field"]')!
    const incrementButton = within(homeField as HTMLElement).getAllByRole('button')[1]
    await userEvent.click(incrementButton)
    await expect(homeInput).toHaveValue('1')

    await userEvent.click(body.getByRole('button', { name: /valider|submit/i }))
    await waitFor(() => expect(args.onFinish).toHaveBeenCalled())
  },
}
