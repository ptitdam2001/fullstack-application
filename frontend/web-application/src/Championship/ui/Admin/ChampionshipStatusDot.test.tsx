import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChampionshipStatusDot } from './ChampionshipStatusDot'

describe('ChampionshipStatusDot', () => {
  it('labels a draft championship', () => {
    render(<ChampionshipStatusDot isDraft={true} isFinished={false} />)
    expect(screen.getByRole('img', { name: 'adminChampionships.status.draft' })).toBeInTheDocument()
  })

  it('labels an in-progress championship', () => {
    render(<ChampionshipStatusDot isDraft={false} isFinished={false} />)
    expect(screen.getByRole('img', { name: 'adminChampionships.status.inProgress' })).toBeInTheDocument()
  })

  it('labels a finished championship', () => {
    render(<ChampionshipStatusDot isDraft={false} isFinished={true} />)
    expect(screen.getByRole('img', { name: 'adminChampionships.status.finished' })).toBeInTheDocument()
  })

  it('prioritizes draft over finished', () => {
    render(<ChampionshipStatusDot isDraft={true} isFinished={true} />)
    expect(screen.getByRole('img', { name: 'adminChampionships.status.draft' })).toBeInTheDocument()
  })
})
