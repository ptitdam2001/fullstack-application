import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Championship } from '../../domain/Championship'
import { ChampionshipHeader } from './ChampionshipHeader'

const championship: Championship = {
  id: 'c1',
  name: 'Championnat U13 Féminin 2026',
  ageCategoryId: 'ac1',
  seasonId: 's1',
  startDate: '2026-09-06',
  endDate: null,
  pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  isDraft: false,
  isFinished: false,
  currentPhaseType: 'GROUP',
  teamsCount: 8,
  matchesPlayed: 4,
  matchesTotal: 14,
}

const meta = {
  component: ChampionshipHeader,
  title: 'Championship/ChampionshipHeader',
  args: {
    championship,
    seasonLabel: '2025–2026',
    categoryLabel: 'U13 Féminin',
    phasesCount: 2,
  },
} satisfies Meta<typeof ChampionshipHeader>

export default meta
type Story = StoryObj<typeof meta>

export const InProgress: Story = { name: 'En cours' }

export const Draft: Story = {
  name: 'Brouillon',
  args: { championship: { ...championship, isDraft: true, teamsCount: 0, matchesPlayed: 0, matchesTotal: 0 } },
}

export const Finished: Story = {
  name: 'Terminé',
  args: { championship: { ...championship, isFinished: true, matchesPlayed: 14 } },
}

export const MissingLabels: Story = {
  name: 'Saison / catégorie non résolues',
  args: { seasonLabel: null, categoryLabel: null },
}
