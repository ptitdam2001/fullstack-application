import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { DashboardTabs } from './DashboardTabs'

vi.mock('./CoachTab/CoachTab', () => ({ CoachTab: () => <div data-testid="coach-tab" /> }))
vi.mock('./PlayerTab/PlayerTab', () => ({ PlayerTab: () => <div data-testid="player-tab" /> }))
vi.mock('./RefereeTab/RefereeTab', () => ({ RefereeTab: () => <div data-testid="referee-tab" /> }))

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>

describe('DashboardTabs', () => {
  it('shows empty state when roles is empty', () => {
    render(<DashboardTabs roles={[]} />, { wrapper })
    expect(screen.getByText('dashboard.noRole.message')).toBeInTheDocument()
    expect(screen.getByText('dashboard.noRole.cta')).toBeInTheDocument()
    expect(screen.queryByText('dashboard.tab.coach')).not.toBeInTheDocument()
  })

  it('renders only the coach tab for COACH role', () => {
    render(<DashboardTabs roles={['COACH']} />, { wrapper })
    expect(screen.getByText('dashboard.tab.coach')).toBeInTheDocument()
    expect(screen.queryByText('dashboard.tab.player')).not.toBeInTheDocument()
    expect(screen.queryByText('dashboard.tab.referee')).not.toBeInTheDocument()
  })

  it('renders coach and player tabs for COACH + PLAYER roles', () => {
    render(<DashboardTabs roles={['COACH', 'PLAYER']} />, { wrapper })
    expect(screen.getByText('dashboard.tab.coach')).toBeInTheDocument()
    expect(screen.getByText('dashboard.tab.player')).toBeInTheDocument()
    expect(screen.queryByText('dashboard.tab.referee')).not.toBeInTheDocument()
  })

  it('renders player and referee tabs but not coach for PLAYER + REFEREE roles', () => {
    render(<DashboardTabs roles={['PLAYER', 'REFEREE']} />, { wrapper })
    expect(screen.queryByText('dashboard.tab.coach')).not.toBeInTheDocument()
    expect(screen.getByText('dashboard.tab.player')).toBeInTheDocument()
    expect(screen.getByText('dashboard.tab.referee')).toBeInTheDocument()
  })
})