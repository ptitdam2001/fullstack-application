import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Championship } from '../../domain/Championship'
import { ChampionshipHeader } from './ChampionshipHeader'

const championship: Championship = {
  id: 'c1',
  name: 'Championnat U13 Féminin 2026',
  ageCategoryId: 'ac1',
  seasonId: 's1',
  startDate: null,
  endDate: null,
  pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  isDraft: false,
  isFinished: false,
  currentPhaseType: 'GROUP',
  teamsCount: 8,
  matchesPlayed: 4,
  matchesTotal: 10,
}

describe('ChampionshipHeader', () => {
  it('renders the championship name', () => {
    render(
      <ChampionshipHeader
        championship={championship}
        seasonLabel="2025–2026"
        categoryLabel="U13 Féminin"
        phasesCount={2}
      />
    )
    expect(screen.getByText('Championnat U13 Féminin 2026')).toBeInTheDocument()
  })

  it('renders resolved season and category labels', () => {
    render(
      <ChampionshipHeader
        championship={championship}
        seasonLabel="2025–2026"
        categoryLabel="U13 Féminin"
        phasesCount={2}
      />
    )
    expect(screen.getByText('2025–2026')).toBeInTheDocument()
    expect(screen.getByText('U13 Féminin')).toBeInTheDocument()
  })

  it('renders a dash when season or category label is missing', () => {
    render(<ChampionshipHeader championship={championship} seasonLabel={null} categoryLabel={null} phasesCount={2} />)
    expect(screen.getAllByText('—')).toHaveLength(2)
  })

  it('renders the in-progress status i18n key', () => {
    render(<ChampionshipHeader championship={championship} seasonLabel={null} categoryLabel={null} phasesCount={2} />)
    expect(screen.getByText('adminChampionships.status.inProgress')).toBeInTheDocument()
  })

  it('renders the points config summary', () => {
    const { container } = render(
      <ChampionshipHeader championship={championship} seasonLabel={null} categoryLabel={null} phasesCount={2} />
    )
    expect(container.textContent).toContain('championshipDetail.points.win 3')
    expect(container.textContent).toContain('championshipDetail.points.forfeit 0')
  })

  it('renders phases/teams/matches stats', () => {
    render(<ChampionshipHeader championship={championship} seasonLabel={null} categoryLabel={null} phasesCount={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('4/10')).toBeInTheDocument()
  })
})
