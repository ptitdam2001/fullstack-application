import { render, screen, fireEvent } from '@testing-library/react'
import { type ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Table, TableHeader, TableHead, TableBody } from '@repo/design-system'
import { AdminChampionshipTableRow } from './AdminChampionshipTableRow'
import type { ChampionshipRow } from './AdminChampionshipTable'

const wrapper = ({ children }: { children: ReactNode }) => (
  <Table>
    <TableHeader>
      <TableHead />
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
  isDraft: false,
}

describe('AdminChampionshipTableRow', () => {
  it('renders the championship name, season and category', () => {
    render(<AdminChampionshipTableRow championship={championship} onResume={vi.fn()} />, { wrapper })
    expect(screen.getByText('Championnat U13 2026')).toBeInTheDocument()
    expect(screen.getByText('2025-2026')).toBeInTheDocument()
    expect(screen.getByText('U13')).toBeInTheDocument()
  })

  it('falls back to a muted placeholder when season or category is unresolved', () => {
    render(
      <AdminChampionshipTableRow
        championship={{ ...championship, seasonLabel: null, categoryLabel: null }}
        onResume={vi.fn()}
      />,
      { wrapper }
    )
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('does not show the resume action when the championship is not a draft', () => {
    render(<AdminChampionshipTableRow championship={championship} onResume={vi.fn()} />, { wrapper })
    expect(screen.queryByText('adminChampionships.action.resume')).not.toBeInTheDocument()
  })

  it('shows the resume action and calls onResume when the championship is a draft', () => {
    const onResume = vi.fn()
    render(<AdminChampionshipTableRow championship={{ ...championship, isDraft: true }} onResume={onResume} />, {
      wrapper,
    })

    const button = screen.getByRole('button', { name: 'adminChampionships.action.resume' })
    fireEvent.click(button)
    expect(onResume).toHaveBeenCalledWith('champ-1')
  })
})
