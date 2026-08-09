import { useReducer } from 'react'
import type { PointsConfig } from '../domain/Championship'
import { MatchMode } from '../domain/Group'
import { PhaseType } from '../domain/Phase'

export const WIZARD_STEPS = [
  { key: 'season', num: '1', labelId: 'championshipWizard.step.season' },
  { key: 'category', num: '2', labelId: 'championshipWizard.step.category' },
  { key: 'name', num: '3', labelId: 'championshipWizard.step.name' },
  { key: 'phase', num: '4', labelId: 'championshipWizard.step.phase' },
  { key: 'teams', num: '4b', labelId: 'championshipWizard.step.teams' },
  { key: 'config', num: '4c', labelId: 'championshipWizard.step.config' },
] as const

export type ChampionshipWizardGroup = {
  id: string
  name: string
  teamIds: string[]
  matchMode: MatchMode
  generated: boolean
}

type WizardState = {
  step: number
  seasonId: string | null
  categoryId: string | null
  name: string
  championshipId: string | null
  phaseType: PhaseType | null
  phaseId: string | null
  teamIds: string[]
  groups: ChampionshipWizardGroup[]
  points: PointsConfig
  maxRank: number
  groupIdSeq: number
}

type WizardAction =
  | { type: 'SET_SEASON'; seasonId: string }
  | { type: 'SET_CATEGORY'; categoryId: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_CHAMPIONSHIP_ID'; championshipId: string }
  | { type: 'SET_PHASE_TYPE'; phaseType: PhaseType }
  | { type: 'SET_PHASE_ID'; phaseId: string }
  | { type: 'TOGGLE_TEAM'; teamId: string }
  | { type: 'ADD_GROUP' }
  | { type: 'REMOVE_GROUP'; groupId: string }
  | { type: 'RENAME_GROUP'; groupId: string; name: string }
  | { type: 'SET_GROUP_MATCH_MODE'; groupId: string; matchMode: MatchMode }
  | { type: 'SET_GROUP_GENERATED'; groupId: string; generated: boolean }
  | { type: 'ASSIGN_TEAM'; teamId: string; groupId: string | null }
  | { type: 'STEP_POINTS'; key: keyof PointsConfig; delta: number }
  | { type: 'SET_MAX_RANK'; maxRank: number }
  | { type: 'GO_TO'; step: number }
  | { type: 'NEXT' }
  | { type: 'BACK' }

const defaultGroup = (index: number): ChampionshipWizardGroup => ({
  id: `g${index}`,
  name: `Poule ${String.fromCharCode(65 + index - 1)}`,
  teamIds: [],
  matchMode: MatchMode.SINGLE,
  generated: false,
})

const initialState: WizardState = {
  step: 0,
  seasonId: null,
  categoryId: null,
  name: '',
  championshipId: null,
  phaseType: null,
  phaseId: null,
  teamIds: [],
  groups: [defaultGroup(1)],
  points: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  maxRank: 2,
  groupIdSeq: 1,
}

const canNextForStep = (state: WizardState, step: number): boolean => {
  switch (step) {
    case 0:
      return Boolean(state.seasonId)
    case 1:
      return Boolean(state.categoryId)
    case 2:
      return state.name.trim().length > 0
    case 3:
      return Boolean(state.phaseType)
    case 4:
    case 5:
      return state.phaseType === PhaseType.GROUP
        ? state.groups.length >= 1 && state.groups.every(g => g.teamIds.length >= 2)
        : state.teamIds.length >= 2
    default:
      return true
  }
}

const wizardReducer = (state: WizardState, action: WizardAction): WizardState => {
  switch (action.type) {
    case 'SET_SEASON':
      return { ...state, seasonId: action.seasonId }
    case 'SET_CATEGORY':
      return { ...state, categoryId: action.categoryId }
    case 'SET_NAME':
      return { ...state, name: action.name }
    case 'SET_CHAMPIONSHIP_ID':
      return { ...state, championshipId: action.championshipId }
    case 'SET_PHASE_TYPE':
      return { ...state, phaseType: action.phaseType }
    case 'SET_PHASE_ID':
      return { ...state, phaseId: action.phaseId }
    case 'TOGGLE_TEAM':
      return {
        ...state,
        teamIds: state.teamIds.includes(action.teamId)
          ? state.teamIds.filter(id => id !== action.teamId)
          : [...state.teamIds, action.teamId],
      }
    case 'ADD_GROUP': {
      const idx = state.groupIdSeq + 1
      return { ...state, groupIdSeq: idx, groups: [...state.groups, defaultGroup(idx)] }
    }
    case 'REMOVE_GROUP':
      return state.groups.length > 1 ? { ...state, groups: state.groups.filter(g => g.id !== action.groupId) } : state
    case 'RENAME_GROUP':
      return { ...state, groups: state.groups.map(g => (g.id === action.groupId ? { ...g, name: action.name } : g)) }
    case 'SET_GROUP_MATCH_MODE':
      return {
        ...state,
        groups: state.groups.map(g =>
          g.id === action.groupId ? { ...g, matchMode: action.matchMode, generated: false } : g
        ),
      }
    case 'SET_GROUP_GENERATED':
      return {
        ...state,
        groups: state.groups.map(g => (g.id === action.groupId ? { ...g, generated: action.generated } : g)),
      }
    case 'ASSIGN_TEAM':
      return {
        ...state,
        groups: state.groups.map(g => {
          const has = g.teamIds.includes(action.teamId)
          const isTarget = g.id === action.groupId
          if (!has && !isTarget) {
            return g
          }
          let ids = has ? g.teamIds.filter(id => id !== action.teamId) : g.teamIds
          if (isTarget && !ids.includes(action.teamId)) {
            ids = [...ids, action.teamId]
          }
          return { ...g, teamIds: ids, generated: false }
        }),
      }
    case 'STEP_POINTS':
      return {
        ...state,
        points: { ...state.points, [action.key]: Math.max(0, state.points[action.key] + action.delta) },
      }
    case 'SET_MAX_RANK':
      return { ...state, maxRank: action.maxRank }
    case 'GO_TO':
      return action.step <= state.step || (action.step === state.step + 1 && canNextForStep(state, state.step))
        ? { ...state, step: action.step }
        : state
    case 'NEXT':
      return state.step < WIZARD_STEPS.length - 1 && canNextForStep(state, state.step)
        ? { ...state, step: state.step + 1 }
        : state
    case 'BACK':
      return state.step > 0 ? { ...state, step: state.step - 1 } : state
    default:
      return state
  }
}

export const useChampionshipWizard = () => {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const canNext = canNextForStep(state, state.step)

  return {
    ...state,
    canNext,
    goTo: (step: number) => dispatch({ type: 'GO_TO', step }),
    next: () => dispatch({ type: 'NEXT' }),
    back: () => dispatch({ type: 'BACK' }),
    setSeasonId: (seasonId: string) => dispatch({ type: 'SET_SEASON', seasonId }),
    setCategoryId: (categoryId: string) => dispatch({ type: 'SET_CATEGORY', categoryId }),
    setName: (name: string) => dispatch({ type: 'SET_NAME', name }),
    setChampionshipId: (championshipId: string) => dispatch({ type: 'SET_CHAMPIONSHIP_ID', championshipId }),
    setPhaseType: (phaseType: PhaseType) => dispatch({ type: 'SET_PHASE_TYPE', phaseType }),
    setPhaseId: (phaseId: string) => dispatch({ type: 'SET_PHASE_ID', phaseId }),
    toggleTeam: (teamId: string) => dispatch({ type: 'TOGGLE_TEAM', teamId }),
    addGroup: () => dispatch({ type: 'ADD_GROUP' }),
    removeGroup: (groupId: string) => dispatch({ type: 'REMOVE_GROUP', groupId }),
    renameGroup: (groupId: string, name: string) => dispatch({ type: 'RENAME_GROUP', groupId, name }),
    setGroupMatchMode: (groupId: string, matchMode: MatchMode) =>
      dispatch({ type: 'SET_GROUP_MATCH_MODE', groupId, matchMode }),
    setGroupGenerated: (groupId: string, generated: boolean) =>
      dispatch({ type: 'SET_GROUP_GENERATED', groupId, generated }),
    assignTeam: (teamId: string, groupId: string | null) => dispatch({ type: 'ASSIGN_TEAM', teamId, groupId }),
    stepper: (key: keyof PointsConfig, delta: number) => dispatch({ type: 'STEP_POINTS', key, delta }),
    setMaxRank: (maxRank: number) => dispatch({ type: 'SET_MAX_RANK', maxRank }),
  }
}
