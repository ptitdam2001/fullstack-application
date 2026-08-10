import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { IntlShape } from 'react-intl'
import { MatchMode } from '../domain/Group'
import { PhaseType } from '../domain/Phase'
import { useChampionshipWizardSummary } from './useChampionshipWizardSummary'

const intl = {
  formatMessage: ({ id }: { id: string }, values?: Record<string, unknown>) =>
    values ? `${id}:${JSON.stringify(values)}` : id,
} as unknown as IntlShape

const baseWizard = {
  name: 'Championnat U13',
  phaseType: null as PhaseType | null,
  groups: [{ id: 'g1', name: 'Poule A', teamIds: [] as string[], matchMode: MatchMode.SINGLE, generated: false }],
  teamIds: [] as string[],
}

const season = { id: 's1', label: '2025-2026', startDate: null, endDate: null, createdAt: '', updatedAt: '' } as never
const category = { id: 'c1', label: 'U13', genre: 'FEMALE', createdAt: '', updatedAt: '' } as never

describe('useChampionshipWizardSummary', () => {
  it('returns null values for teams/config/phase before they are set', () => {
    const { result } = renderHook(() => useChampionshipWizardSummary(baseWizard as never, intl, null, null))
    const byKey = Object.fromEntries(result.current.map(l => [l.key, l.value]))
    expect(byKey.phase).toBeNull()
    expect(byKey.teams).toBeNull()
    expect(byKey.config).toBeNull()
  })

  it('fills season and category labels when selected', () => {
    const { result } = renderHook(() => useChampionshipWizardSummary(baseWizard as never, intl, season, category))
    const byKey = Object.fromEntries(result.current.map(l => [l.key, l.value]))
    expect(byKey.season).toBe('2025-2026')
    expect(byKey.category).toBe('U13')
  })

  it('GROUP: teams value stays null until a group has at least one team', () => {
    const wizard = { ...baseWizard, phaseType: PhaseType.GROUP }
    const { result } = renderHook(() => useChampionshipWizardSummary(wizard as never, intl, null, null))
    expect(result.current.find(l => l.key === 'teams')?.value).toBeNull()
  })

  it('GROUP: teams value formats groupCount/teamCount once teams are assigned', () => {
    const wizard = {
      ...baseWizard,
      phaseType: PhaseType.GROUP,
      groups: [{ id: 'g1', name: 'Poule A', teamIds: ['t1', 't2'], matchMode: MatchMode.SINGLE, generated: false }],
    }
    const { result } = renderHook(() => useChampionshipWizardSummary(wizard as never, intl, null, null))
    expect(result.current.find(l => l.key === 'teams')?.value).toBe(
      'championshipWizard.summary.teamsGroupValue:{"groupCount":1,"teamCount":2}'
    )
  })

  it('KNOCKOUT: teams value formats teamCount once teams are selected', () => {
    const wizard = { ...baseWizard, phaseType: PhaseType.KNOCKOUT, teamIds: ['t1', 't2'] }
    const { result } = renderHook(() => useChampionshipWizardSummary(wizard as never, intl, null, null))
    expect(result.current.find(l => l.key === 'teams')?.value).toBe(
      'championshipWizard.summary.teamsKnockoutValue:{"teamCount":2}'
    )
  })

  it('GROUP: config value is set once at least one group is generated', () => {
    const wizard = {
      ...baseWizard,
      phaseType: PhaseType.GROUP,
      groups: [
        { id: 'g1', name: 'Poule A', teamIds: ['t1', 't2'], matchMode: MatchMode.SINGLE, generated: true },
        { id: 'g2', name: 'Poule B', teamIds: ['t3', 't4'], matchMode: MatchMode.SINGLE, generated: false },
      ],
    }
    const { result } = renderHook(() => useChampionshipWizardSummary(wizard as never, intl, null, null))
    expect(result.current.find(l => l.key === 'config')?.value).toBe(
      'championshipWizard.summary.configGroupValue:{"generatedCount":1,"groupCount":2}'
    )
  })

  it('trims the name and falls back to null when blank', () => {
    const wizard = { ...baseWizard, name: '   ' }
    const { result } = renderHook(() => useChampionshipWizardSummary(wizard as never, intl, null, null))
    expect(result.current.find(l => l.key === 'name')?.value).toBeNull()
  })
})
