import { render, screen } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import { AdminChampionshipTableRow } from './AdminChampionshipTableRow'
import type { ChampionshipRow } from './AdminChampionshipTable'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Table>
    <TableHeader>
      <TableHead />
      <TableHead />
      <TableHead />
    </TableHeader>
    <TableBody>{children}</TableBody>
  </Table>
)

const championship: ChampionshipRow = {
  id: 'champ-1',
  name: 'Championnat U13 2026',
  seasonLabel: '2025-2026',
  categoryLabel: 'U13',
}

describe('AdminChampionshipTableRow', () => {
  it('renders the championship name, season and category', () => {
    render(<AdminChampionshipTableRow championship={championship} />, { wrapper })
    expect(screen.getByText('Championnat U13 2026')).toBeInTheDocument()
    expect(screen.getByText('2025-2026')).toBeInTheDocument()
    expect(screen.getByText('U13')).toBeInTheDocument()
  })

  it('falls back to a muted placeholder when season or category is unresolved', () => {
    render(<AdminChampionshipTableRow championship={{ ...championship, seasonLabel: null, categoryLabel: null }} />, {
      wrapper,
    })
    expect(screen.getAllByText('—')).toHaveLength(2)
  })
})
