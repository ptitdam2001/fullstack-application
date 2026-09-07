import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn, within, userEvent, expect } from 'storybook/test'
import type { Match } from '../../domain/Match'
import { MatchesPanel } from './MatchesPanel'

const matches: Match[] = [
  {
    id: 'm1',
    groupId: 'g1',
    area: null,
    scheduledAt: '2026-09-06T10:00:00.000Z',
    status: 'PLAYED',
    homeTeamId: 't1',
    awayTeamId: 't2',
    homeGoals: 24,
    awayGoals: 19,
    homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
    awayTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
  },
  {
    id: 'm2',
    groupId: 'g1',
    area: null,
    scheduledAt: '2026-09-13T11:30:00.000Z',
    status: 'FORFEITED',
    homeTeamId: 't3',
    awayTeamId: 't1',
    homeGoals: 0,
    awayGoals: 20,
    forfeitedBy: 't3',
    homeTeam: { id: 't3', name: 'Bron Handball', color: '#1a1a1a' },
    awayTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
  },
  {
    id: 'm3',
    groupId: 'g1',
    area: null,
    scheduledAt: '2026-09-27T10:00:00.000Z',
    status: 'SCHEDULED',
    homeTeamId: 't2',
    awayTeamId: 't3',
    homeTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
    awayTeam: { id: 't3', name: 'Bron Handball', color: '#1a1a1a' },
  },
]

const meta = {
  component: MatchesPanel,
  title: 'Championship/MatchesPanel',
  args: {
    matches,
    filter: 'all',
    onFilterChange: fn(),
    onViewAll: fn(),
  },
} satisfies Meta<typeof MatchesPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Tous les matchs' }

export const Empty: Story = { name: 'Aucun match', args: { matches: [] } }

export const ChangeFilter: Story = {
  name: 'Changer le filtre appelle onFilterChange',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('tab', { name: /upcoming|à venir/i }))
    expect(args.onFilterChange).toHaveBeenCalledWith('SCHEDULED')
  },
}

export const ClickViewAll: Story = {
  name: 'Cliquer "Voir tous les matchs" appelle onViewAll',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: /view all matches|voir tous les matchs/i }))
    expect(args.onViewAll).toHaveBeenCalled()
  },
}
