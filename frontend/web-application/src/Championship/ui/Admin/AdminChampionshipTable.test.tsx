import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminChampionshipTable, type ChampionshipRow } from './AdminChampionshipTable'

const championships: ChampionshipRow[] = [
  { id: 'champ-1', name: 'Championnat U13 2026', seasonLabel: '2025-2026', categoryLabel: 'U13' },
  { id: 'champ-2', name: 'Championnat U15 2026', seasonLabel: '2025-2026', categoryLabel: 'U15' },
]

describe('AdminChampionshipTable', () => {
  it('renders table headers', () => {
    render(<AdminChampionshipTable championships={championships} />)
    expect(screen.getByText('adminChampionships.table.name')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.season')).toBeInTheDocument()
    expect(screen.getByText('adminChampionships.table.category')).toBeInTheDocument()
  })

  it('renders a row per championship', () => {
    render(<AdminChampionshipTable championships={championships} />)
    expect(screen.getByText('Championnat U13 2026')).toBeInTheDocument()
    expect(screen.getByText('Championnat U15 2026')).toBeInTheDocument()
  })

  it('renders an empty state when there are no championships', () => {
    render(<AdminChampionshipTable championships={[]} />)
    expect(screen.getByText('adminChampionships.table.empty')).toBeInTheDocument()
  })
})
