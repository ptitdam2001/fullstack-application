import type { Meta, StoryObj } from '@storybook/react-vite'

import { Table } from './Table'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { TableFooter } from './TableFooter'
import { TableRow } from './TableRow'
import { TableHead } from './TableHead'
import { TableCell } from './TableCell'
import { TableCaption } from './TableCaption'
import { Badge } from '../Badge/Badge'

const meta = {
  component: Table,
} satisfies Meta<typeof Table>

export default meta

type Story = StoryObj<typeof meta>

const standings = [
  { rank: 1, team: 'Équipe A', played: 10, won: 8, drawn: 1, lost: 1, gf: 24, ga: 8, pts: 25 },
  { rank: 2, team: 'Équipe B', played: 10, won: 7, drawn: 2, lost: 1, gf: 20, ga: 10, pts: 23 },
  { rank: 3, team: 'Équipe C', played: 10, won: 5, drawn: 3, lost: 2, gf: 15, ga: 12, pts: 18 },
  { rank: 4, team: 'Équipe D', played: 10, won: 4, drawn: 2, lost: 4, gf: 12, ga: 16, pts: 14 },
  { rank: 5, team: 'Équipe E', played: 10, won: 1, drawn: 0, lost: 9, gf: 5, ga: 30, pts: 3 },
]

export const Standings: Story = {
  render: () => (
    <Table aria-label="Classement — Championnat U13 — Phase 1">
      <TableCaption>Classement — Championnat U13 — Phase 1</TableCaption>
      <TableHeader>
        <TableHead className="w-10 text-center">#</TableHead>
        <TableHead>Équipe</TableHead>
        <TableHead className="text-center">J</TableHead>
        <TableHead className="text-center">G</TableHead>
        <TableHead className="text-center">N</TableHead>
        <TableHead className="text-center">P</TableHead>
        <TableHead className="text-center">BP</TableHead>
        <TableHead className="text-center">BC</TableHead>
        <TableHead className="text-center font-bold">Pts</TableHead>
      </TableHeader>
      <TableBody items={standings}>
        {row => (
          <TableRow id={String(row.rank)}>
            <TableCell className="text-center text-muted-foreground">{row.rank}</TableCell>
            <TableCell className="font-medium">{row.team}</TableCell>
            <TableCell className="text-center">{row.played}</TableCell>
            <TableCell className="text-center">{row.won}</TableCell>
            <TableCell className="text-center">{row.drawn}</TableCell>
            <TableCell className="text-center">{row.lost}</TableCell>
            <TableCell className="text-center">{row.gf}</TableCell>
            <TableCell className="text-center">{row.ga}</TableCell>
            <TableCell className="text-center font-bold">{row.pts}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  ),
}

export const MatchList: Story = {
  render: () => (
    <Table aria-label="Liste des matchs">
      <TableHeader>
        <TableHead>Date</TableHead>
        <TableHead>Domicile</TableHead>
        <TableHead className="text-center">Score</TableHead>
        <TableHead>Extérieur</TableHead>
        <TableHead>Statut</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow id="m1">
          <TableCell>12/04/2025</TableCell>
          <TableCell>Équipe A</TableCell>
          <TableCell className="text-center font-mono">3 — 1</TableCell>
          <TableCell>Équipe B</TableCell>
          <TableCell><Badge variant="outline">Terminé</Badge></TableCell>
        </TableRow>
        <TableRow id="m2">
          <TableCell>19/04/2025</TableCell>
          <TableCell>Équipe C</TableCell>
          <TableCell className="text-center font-mono">— </TableCell>
          <TableCell>Équipe D</TableCell>
          <TableCell><Badge>À venir</Badge></TableCell>
        </TableRow>
        <TableRow id="m3">
          <TableCell>26/04/2025</TableCell>
          <TableCell>Équipe E</TableCell>
          <TableCell className="text-center font-mono">0 — 4</TableCell>
          <TableCell>Équipe A</TableCell>
          <TableCell><Badge variant="outline">Terminé</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Table aria-label="Points par équipe">
      <TableHeader>
        <TableHead>Équipe</TableHead>
        <TableHead className="text-right">Points</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow id="r1">
          <TableCell>Équipe A</TableCell>
          <TableCell className="text-right">25</TableCell>
        </TableRow>
        <TableRow id="r2">
          <TableCell>Équipe B</TableCell>
          <TableCell className="text-right">23</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <tr>
          <td className="p-2 font-medium">Total</td>
          <td className="p-2 text-right font-medium">48</td>
        </tr>
      </TableFooter>
    </Table>
  ),
}
