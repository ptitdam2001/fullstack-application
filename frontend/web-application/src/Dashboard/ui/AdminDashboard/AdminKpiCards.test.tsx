import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { type ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { AdminKpiCards } from './AdminKpiCards'

// react-intl is globally mocked in tests/setup.ts
// FormattedMessage/formatMessage render the `id` prop — assert on the key, not the translated string

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>

const props = {
  pendingScoreCount: 4,
  pendingActivationCount: 2,
  activeChampionshipCount: 3,
  draftChampionshipCount: 1,
  teamCount: 12,
}

describe('AdminKpiCards', () => {
  it('renders the 5 kpi cards with their values', () => {
    render(<AdminKpiCards {...props} />, { wrapper })

    expect(screen.getByText('adminDashboard.kpi.pendingScore')).toBeInTheDocument()
    expect(screen.getByText('adminDashboard.kpi.pendingActivation')).toBeInTheDocument()
    expect(screen.getByText('adminDashboard.kpi.championships')).toBeInTheDocument()
    expect(screen.getByText('adminDashboard.kpi.draftChampionships')).toBeInTheDocument()
    expect(screen.getByText('adminDashboard.kpi.teams')).toBeInTheDocument()

    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('distinguishes active championships from championships still in draft', () => {
    render(<AdminKpiCards {...props} activeChampionshipCount={5} draftChampionshipCount={7} />, { wrapper })

    const activeCard = screen.getByText('adminDashboard.kpi.championships').closest('a')
    const draftCard = screen.getByText('adminDashboard.kpi.draftChampionships').closest('a')

    expect(activeCard).toHaveTextContent('5')
    expect(draftCard).toHaveTextContent('7')
    expect(activeCard).not.toHaveTextContent('7')
    expect(draftCard).not.toHaveTextContent('5')
  })

  it('links the active and draft championship cards to the admin championships list', () => {
    render(<AdminKpiCards {...props} />, { wrapper })

    expect(screen.getByText('adminDashboard.kpi.championships').closest('a')).toHaveAttribute(
      'href',
      '/app/admin/championships'
    )
    expect(screen.getByText('adminDashboard.kpi.draftChampionships').closest('a')).toHaveAttribute(
      'href',
      '/app/admin/championships'
    )
  })
})
