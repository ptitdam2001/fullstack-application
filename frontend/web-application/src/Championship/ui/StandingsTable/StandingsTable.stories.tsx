import type { Meta, StoryObj } from '@storybook/react-vite'
import type { StandingRow } from '../../domain/Standing'
import { StandingsTable } from './StandingsTable'

const teams = {
  t1: { name: 'HB Villeurbanne', color: '#e36b3a' },
  t2: { name: 'Lyon HB Club', color: '#2f6fed' },
  t3: { name: 'Bron Handball', color: '#1a1a1a' },
}

const rows: StandingRow[] = [
  {
    rank: 1,
    teamId: 't1',
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    forfeited: 0,
    goalsFor: 60,
    goalsAgainst: 40,
    goalDifference: 20,
    points: 9,
  },
  {
    rank: 2,
    teamId: 't2',
    played: 3,
    won: 2,
    drawn: 0,
    lost: 1,
    forfeited: 0,
    goalsFor: 55,
    goalsAgainst: 50,
    goalDifference: 5,
    points: 6,
  },
  {
    rank: 3,
    teamId: 't3',
    played: 3,
    won: 0,
    drawn: 0,
    lost: 3,
    forfeited: 0,
    goalsFor: 30,
    goalsAgainst: 55,
    goalDifference: -25,
    points: 0,
  },
]

const meta = {
  component: StandingsTable,
  title: 'Championship/StandingsTable',
  args: { rows, teams, qualifyRank: 2 },
} satisfies Meta<typeof StandingsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Classement avec 2 qualifiés' }

export const Empty: Story = { name: 'Aucun classement', args: { rows: [], teams: {} } }
