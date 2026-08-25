import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect, waitFor } from 'storybook/test'
import { MatchStatus } from '../../domain/Match'
import type { Match } from '../../domain/Match'
import { MatchCard } from './MatchCard'

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
  component: MatchCard,
  title: 'Match/Admin/MatchCard',
  args: {
    match: baseMatch,
    onScoreClick: fn(),
    onDeleteClick: fn(),
  },
} satisfies Meta<typeof MatchCard>

export default meta
type Story = StoryObj<typeof meta>

export const Scheduled: Story = {
  name: 'Match à venir',
}

export const Played: Story = {
  name: 'Match joué',
  args: {
    match: { ...baseMatch, status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 },
  },
}

export const Forfeited: Story = {
  name: 'Match forfait',
  args: {
    match: { ...baseMatch, status: MatchStatus.FORFEITED, forfeitedBy: 'team-2' },
  },
}

export const TeamsNotSetYet: Story = {
  name: 'Équipes non définies',
  args: {
    match: { ...baseMatch, homeTeam: null, awayTeam: null },
  },
}

export const ClickEnterScoreButton: Story = {
  name: 'Bouton "Saisir le score" appelle onScoreClick',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /saisir le score|enter score/i }))
    expect(args.onScoreClick).toHaveBeenCalledWith(baseMatch)
  },
}

export const OpenMenu: Story = {
  name: "Le menu ⋯ s'ouvre au clic",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /actions du match|match actions/i }))
    await expect(within(document.body).getByRole('menu')).toBeVisible()
  },
}

export const MenuEnterScoreCallsOnScoreClick: Story = {
  name: 'Menu "Saisir le score" appelle onScoreClick',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /actions du match|match actions/i }))
    const menu = within(document.body)
    await userEvent.click(await menu.findByRole('menuitem', { name: /saisir le score|enter score/i }))
    await waitFor(() => expect(args.onScoreClick).toHaveBeenCalledWith(baseMatch))
  },
}

export const MenuDeleteEnabledWhenScheduled: Story = {
  name: 'Menu "Supprimer" actif quand le match est à venir',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /actions du match|match actions/i }))
    const menu = within(document.body)
    const deleteItem = await menu.findByRole('menuitem', { name: /supprimer|delete/i })
    await userEvent.click(deleteItem)
    await waitFor(() => expect(args.onDeleteClick).toHaveBeenCalledWith(baseMatch))
  },
}

export const MenuDeleteDisabledWhenPlayed: Story = {
  name: 'Menu "Supprimer" désactivé quand le match est joué',
  args: {
    match: { ...baseMatch, status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /actions du match|match actions/i }))
    const menu = within(document.body)
    const deleteItem = await menu.findByRole('menuitem', { name: /supprimer|delete/i })
    await expect(deleteItem).toHaveAttribute('aria-disabled', 'true')
  },
}
