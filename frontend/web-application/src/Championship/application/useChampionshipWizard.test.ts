import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MatchMode } from '../domain/Group'
import { PhaseType } from '../domain/Phase'
import { useChampionshipWizard, WIZARD_STEPS } from './useChampionshipWizard'

describe('useChampionshipWizard', () => {
  it('starts on step 0 with one empty group and default points', () => {
    const { result } = renderHook(() => useChampionshipWizard())
    expect(result.current.step).toBe(0)
    expect(result.current.groups).toHaveLength(1)
    expect(result.current.groups[0].teamIds).toEqual([])
    expect(result.current.points).toEqual({ win: 3, draw: 2, loss: 1, forfeit: 0 })
    expect(result.current.maxRank).toBe(2)
  })

  describe('canNext / navigation', () => {
    it('blocks next on step 0 until a season is selected', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      expect(result.current.canNext).toBe(false)

      act(() => result.current.next())
      expect(result.current.step).toBe(0)

      act(() => result.current.setSeasonId('s1'))
      expect(result.current.canNext).toBe(true)

      act(() => result.current.next())
      expect(result.current.step).toBe(1)
    })

    it('blocks next on step 2 until name is non-blank', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => {
        result.current.setSeasonId('s1')
        result.current.setCategoryId('c1')
      })
      act(() => result.current.next())
      act(() => result.current.next())
      expect(result.current.step).toBe(2)
      expect(result.current.canNext).toBe(false)

      act(() => result.current.setName('   '))
      expect(result.current.canNext).toBe(false)

      act(() => result.current.setName('Championnat U13'))
      expect(result.current.canNext).toBe(true)
    })

    it('back() decrements the step, no-op at step 0', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.back())
      expect(result.current.step).toBe(0)

      act(() => result.current.setSeasonId('s1'))
      act(() => result.current.next())
      expect(result.current.step).toBe(1)
      act(() => result.current.back())
      expect(result.current.step).toBe(0)
    })

    it('goTo jumps to any completed step or the immediate next reachable one, not further', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.setSeasonId('s1'))
      act(() => result.current.next())

      act(() => result.current.goTo(0))
      expect(result.current.step).toBe(0)

      act(() => result.current.goTo(5))
      expect(result.current.step).toBe(0)
    })
  })

  describe('step 4 (phase) canNext', () => {
    it('requires a phaseType to be selected', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => {
        result.current.setSeasonId('s1')
        result.current.setCategoryId('c1')
        result.current.setName('Championnat')
      })
      act(() => result.current.next())
      act(() => result.current.next())
      act(() => result.current.next())
      expect(result.current.step).toBe(3)
      expect(result.current.canNext).toBe(false)

      act(() => result.current.setPhaseType(PhaseType.GROUP))
      expect(result.current.canNext).toBe(true)
    })
  })

  describe('KNOCKOUT team selection', () => {
    it('toggleTeam adds and removes ids, canNext requires >= 2 teams', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => {
        result.current.setSeasonId('s1')
        result.current.setCategoryId('c1')
        result.current.setName('Championnat')
        result.current.setPhaseType(PhaseType.KNOCKOUT)
      })
      act(() => result.current.next())
      act(() => result.current.next())
      act(() => result.current.next())
      act(() => result.current.next())
      expect(result.current.step).toBe(4)
      expect(result.current.canNext).toBe(false)

      act(() => result.current.toggleTeam('t1'))
      expect(result.current.teamIds).toEqual(['t1'])
      expect(result.current.canNext).toBe(false)

      act(() => result.current.toggleTeam('t2'))
      expect(result.current.canNext).toBe(true)

      act(() => result.current.toggleTeam('t1'))
      expect(result.current.teamIds).toEqual(['t2'])
      expect(result.current.canNext).toBe(false)
    })
  })

  describe('GROUP pools', () => {
    it('addGroup appends a pool with an incrementing letter name', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.addGroup())
      expect(result.current.groups).toHaveLength(2)
      expect(result.current.groups[1].name).toBe('Poule B')
    })

    it('removeGroup keeps at least one pool', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      const onlyGroupId = result.current.groups[0].id
      act(() => result.current.removeGroup(onlyGroupId))
      expect(result.current.groups).toHaveLength(1)
    })

    it('removeGroup removes a non-last pool', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.addGroup())
      const firstId = result.current.groups[0].id
      act(() => result.current.removeGroup(firstId))
      expect(result.current.groups).toHaveLength(1)
      expect(result.current.groups[0].name).toBe('Poule B')
    })

    it('renameGroup updates the pool name', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      const id = result.current.groups[0].id
      act(() => result.current.renameGroup(id, 'Poule Nord'))
      expect(result.current.groups[0].name).toBe('Poule Nord')
    })

    it('setGroupMatchMode updates the mode and resets generated', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      const id = result.current.groups[0].id
      act(() => result.current.setGroupGenerated(id, true))
      act(() => result.current.setGroupMatchMode(id, MatchMode.HOME_AND_AWAY))
      expect(result.current.groups[0].matchMode).toBe(MatchMode.HOME_AND_AWAY)
      expect(result.current.groups[0].generated).toBe(false)
    })

    it('assignTeam moves a team into a pool and clears its previous pool', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.addGroup())
      const [groupA, groupB] = result.current.groups

      act(() => result.current.assignTeam('t1', groupA.id))
      expect(result.current.groups[0].teamIds).toEqual(['t1'])

      act(() => result.current.assignTeam('t1', groupB.id))
      expect(result.current.groups[0].teamIds).toEqual([])
      expect(result.current.groups[1].teamIds).toEqual(['t1'])
    })

    it('assignTeam with null unassigns the team', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      const groupId = result.current.groups[0].id
      act(() => result.current.assignTeam('t1', groupId))
      act(() => result.current.assignTeam('t1', null))
      expect(result.current.groups[0].teamIds).toEqual([])
    })

    it('canNext for step 4 requires every pool to have >= 2 teams', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => {
        result.current.setSeasonId('s1')
        result.current.setCategoryId('c1')
        result.current.setName('Championnat')
        result.current.setPhaseType(PhaseType.GROUP)
      })
      act(() => result.current.next())
      act(() => result.current.next())
      act(() => result.current.next())
      act(() => result.current.next())
      expect(result.current.step).toBe(4)
      expect(result.current.canNext).toBe(false)

      const groupId = result.current.groups[0].id
      act(() => result.current.assignTeam('t1', groupId))
      expect(result.current.canNext).toBe(false)

      act(() => result.current.assignTeam('t2', groupId))
      expect(result.current.canNext).toBe(true)
    })
  })

  describe('points stepper', () => {
    it('increments and decrements, clamped at 0', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      act(() => result.current.stepper('forfeit', -1))
      expect(result.current.points.forfeit).toBe(0)

      act(() => result.current.stepper('win', 1))
      expect(result.current.points.win).toBe(4)

      act(() => result.current.stepper('win', -10))
      expect(result.current.points.win).toBe(0)
    })
  })

  describe('championshipId', () => {
    it('starts null and can be set once the championship is created', () => {
      const { result } = renderHook(() => useChampionshipWizard())
      expect(result.current.championshipId).toBeNull()

      act(() => result.current.setChampionshipId('champ-1'))
      expect(result.current.championshipId).toBe('champ-1')
    })
  })

  it('exposes all 6 wizard steps', () => {
    expect(WIZARD_STEPS).toHaveLength(6)
    expect(WIZARD_STEPS.map(s => s.key)).toEqual(['season', 'category', 'name', 'phase', 'teams', 'config'])
  })
})
