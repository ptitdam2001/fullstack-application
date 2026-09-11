import { test, expect } from '@playwright/test'
import type { Championship, Group, GroupStandings, Match, Phase, Team } from '@Sdk/model'
import { MatchMode, MatchStatus, PhaseType } from '@Sdk/model'
import { mockMsw } from './mockMsw'

// MSW's generated mocks randomize every response (see *.msw.ts), so phases/groups/matches differ
// on every request. Playwright's page.route() can't make them deterministic either — MSW's Service
// Worker answers requests before they reach the network layer Playwright intercepts — so this suite
// queues MSW overrides via mockMsw() instead (see src/mocks/e2eOverrides.ts). Fixed championship —
// one GROUP phase (1 group, 1 scheduled match) and one KNOCKOUT phase (played semi-finals, one
// unresolved final) — makes standings + bracket assertions deterministic.
const BACKEND = 'http://localhost:3000'
const championshipId = 'e2e-champ-1'
const groupPhaseId = 'e2e-phase-group'
const knockoutPhaseId = 'e2e-phase-knockout'
const groupId = 'e2e-group-a'
const bracketId = 'e2e-bracket-1'

const team = (id: string, name: string, color: string): Team => ({ id, name, color })

const teams: Team[] = [
  team('e2e-team-1', 'Home Handball', '#e36b3a'),
  team('e2e-team-2', 'Away Handball', '#2f6fed'),
  team('e2e-team-3', 'Third Handball', '#1a1a1a'),
  team('e2e-team-4', 'Fourth Handball', '#5b8def'),
]

const championship: Championship = {
  id: championshipId,
  name: 'E2E Championship',
  ageCategoryId: 'e2e-age-category',
  seasonId: 'e2e-season',
  pointsConfig: { win: 3, draw: 2, loss: 1, forfeit: 0 },
  isDraft: false,
  isFinished: false,
  currentPhaseType: PhaseType.KNOCKOUT,
  teamsCount: 4,
  matchesPlayed: 2,
  matchesTotal: 4,
}

const phases: Phase[] = [
  { id: groupPhaseId, championshipId, type: PhaseType.GROUP, order: 1, name: 'Pools' },
  { id: knockoutPhaseId, championshipId, type: PhaseType.KNOCKOUT, order: 2, name: 'Final phase' },
]

const groups: Group[] = [
  {
    id: groupId,
    phaseId: groupPhaseId,
    name: 'Pool A',
    matchMode: MatchMode.HOME_AND_AWAY,
    teamIds: [teams[0].id, teams[1].id],
  },
]

const standings: GroupStandings = {
  groupId,
  rows: [
    {
      rank: 1,
      teamId: teams[0].id,
      played: 1,
      won: 1,
      drawn: 0,
      lost: 0,
      forfeited: 0,
      goalsFor: 3,
      goalsAgainst: 1,
      goalDifference: 2,
      points: 3,
    },
    {
      rank: 2,
      teamId: teams[1].id,
      played: 1,
      won: 0,
      drawn: 0,
      lost: 1,
      forfeited: 0,
      goalsFor: 1,
      goalsAgainst: 3,
      goalDifference: -2,
      points: 1,
    },
  ],
}

const matches: Match[] = [
  {
    id: 'e2e-match-group-1',
    groupId,
    area: null,
    status: MatchStatus.SCHEDULED,
    homeTeamId: teams[0].id,
    awayTeamId: teams[1].id,
    homeTeam: teams[0],
    awayTeam: teams[1],
    stageName: 'Pool A',
  },
  {
    id: 'e2e-match-semi-1',
    bracketId,
    round: 1,
    bracketPosition: 1,
    area: null,
    status: MatchStatus.PLAYED,
    homeTeamId: teams[0].id,
    awayTeamId: teams[1].id,
    homeGoals: 3,
    awayGoals: 1,
    homeTeam: teams[0],
    awayTeam: teams[1],
    stageName: 'Final phase',
  },
  {
    id: 'e2e-match-semi-2',
    bracketId,
    round: 1,
    bracketPosition: 2,
    area: null,
    status: MatchStatus.PLAYED,
    homeTeamId: teams[2].id,
    awayTeamId: teams[3].id,
    homeGoals: 2,
    awayGoals: 2,
    homeTeam: teams[2],
    awayTeam: teams[3],
    stageName: 'Final phase',
  },
  {
    id: 'e2e-match-final',
    bracketId,
    round: 2,
    bracketPosition: 1,
    area: null,
    status: MatchStatus.SCHEDULED,
    homeTeamId: null,
    awayTeamId: null,
    stageName: 'Final phase',
  },
]

test.describe('admin — championship detail', () => {
  test.beforeEach(async ({ page }) => {
    await mockMsw(page, 'get', `${BACKEND}/championship/${championshipId}`, championship)
    await mockMsw(page, 'get', `${BACKEND}/championship/${championshipId}/phases`, phases)
    await mockMsw(page, 'get', `${BACKEND}/phase/${groupPhaseId}/groups`, groups)
    await mockMsw(page, 'get', `${BACKEND}/group/${groupId}/standings`, standings)
    await mockMsw(page, 'get', `${BACKEND}/teams`, teams)
    await mockMsw(page, 'get', `${BACKEND}/matches`, matches)

    await page.goto(`/app/admin/championships/${championshipId}`)
    await expect(page.getByRole('heading', { name: 'E2E Championship' })).toBeVisible({ timeout: 10_000 })
  })

  test('shows the group phase standings and matches by default', async ({ page }) => {
    // Both StandingsTable and MatchesPanel render the team names — assert at least one of each is visible.
    await expect(page.getByText('Home Handball').first()).toBeVisible()
    await expect(page.getByText('Away Handball').first()).toBeVisible()
  })

  test('switching to the knockout phase renders the real bracket with scores', async ({ page }) => {
    await page.getByRole('tab', { name: /Final phase/i }).click()

    await expect(page.getByText('Semi-final')).toBeVisible({ timeout: 5_000 })
    await expect(page.getByText('Final', { exact: true })).toBeVisible()

    const semiFinal1 = page.getByText('Home Handball').last()
    await expect(semiFinal1).toBeVisible()
    await expect(page.getByText('3', { exact: true })).toBeVisible()

    // The final's teams aren't resolved yet — placeholder dash, not a name
    await expect(page.getByText('—').first()).toBeVisible()
  })
})
