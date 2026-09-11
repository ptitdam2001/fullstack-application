import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Match } from '../../domain/Match'
import { KnockoutBracket } from './KnockoutBracket'

const semiFinals: Match[] = [
  {
    id: 'sf1',
    bracketId: 'b1',
    round: 1,
    bracketPosition: 1,
    area: null,
    status: 'PLAYED',
    homeTeamId: 't1',
    awayTeamId: 't2',
    homeGoals: 3,
    awayGoals: 1,
    homeTeam: { id: 't1', name: 'HB Villeurbanne', color: '#e36b3a' },
    awayTeam: { id: 't2', name: 'Lyon HB Club', color: '#2f6fed' },
  },
  {
    id: 'sf2',
    bracketId: 'b1',
    round: 1,
    bracketPosition: 2,
    area: null,
    status: 'PLAYED',
    homeTeamId: 't3',
    awayTeamId: 't4',
    homeGoals: 2,
    awayGoals: 2,
    homeTeam: { id: 't3', name: 'Bron Handball', color: '#1a1a1a' },
    awayTeam: { id: 't4', name: 'ASUL Vaulx-en-Velin', color: '#5b8def' },
  },
]

const final: Match = {
  id: 'final',
  bracketId: 'b1',
  round: 2,
  bracketPosition: 1,
  area: null,
  status: 'SCHEDULED',
  homeTeamId: null,
  awayTeamId: null,
}

const meta = {
  component: KnockoutBracket,
  title: 'Championship/KnockoutBracket',
  args: {
    matches: [...semiFinals, final],
  },
} satisfies Meta<typeof KnockoutBracket>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: 'Demi-finales jouées, finale à déterminer' }

export const Empty: Story = { name: 'Aucun tableau généré', args: { matches: [] } }
