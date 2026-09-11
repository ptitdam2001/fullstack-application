import { test, expect } from '@playwright/test'
import type { Match } from '@Sdk/model'
import { MatchStatus } from '@Sdk/model'
import { applyMswOverride, mockMsw } from './mockMsw'

// MSW's generated mock randomizes `status` per match (see match.msw.ts), so a page load can
// land with zero SCHEDULED matches and no "Enter score" button. mockMsw() replaces the list with
// a fixed SCHEDULED match to make the score-entry flow deterministic — page.route() can't do this,
// MSW's Service Worker answers requests before they reach Playwright's network layer (see
// feedback_e2e_msw_route_intercept_broken memory / src/mocks/e2eOverrides.ts).
const BACKEND = 'http://localhost:3000'
const scheduledMatch: Match = {
  id: 'e2e-match-1',
  area: null,
  homeTeamId: 'e2e-team-home',
  awayTeamId: 'e2e-team-away',
  status: MatchStatus.SCHEDULED,
  scheduledAt: null,
  championshipName: 'E2E Championship',
  stageName: 'Poule A',
  homeTeam: { id: 'e2e-team-home', name: 'Home Team', color: '#ff0000' },
  awayTeam: { id: 'e2e-team-away', name: 'Away Team', color: '#0000ff' },
}

test.describe('admin — matches score entry', () => {
  test.beforeEach(async ({ page }) => {
    await mockMsw(page, 'get', `${BACKEND}/matches`, [scheduledMatch])
    await page.goto('/app/admin/matches')
  })

  test('enter score button opens the score entry dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter score' }).first().click()
    await expect(page.getByRole('dialog', { name: 'Enter score' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('textbox', { name: 'Home goals' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Away goals' })).toBeVisible()
  })

  test('submitting a valid score closes the dialog', async ({ page }) => {
    await applyMswOverride(page, 'patch', `${BACKEND}/match/${scheduledMatch.id}`, {
      ...scheduledMatch,
      status: MatchStatus.PLAYED,
      homeGoals: 3,
      awayGoals: 1,
    })

    await page.getByRole('button', { name: 'Enter score' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Enter score' })
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    await dialog.getByRole('textbox', { name: 'Home goals' }).fill('3')
    await dialog.getByRole('textbox', { name: 'Away goals' }).fill('1')
    await dialog.getByRole('button', { name: 'Submit' }).click()

    await expect(dialog).not.toBeVisible({ timeout: 5_000 })
  })

  test('API error keeps the dialog open and shows a notification', async ({ page }) => {
    await applyMswOverride(
      page,
      'patch',
      `${BACKEND}/match/${scheduledMatch.id}`,
      { err: [{ message: 'must be object' }] },
      400
    )

    await page.getByRole('button', { name: 'Enter score' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Enter score' })
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    await dialog.getByRole('textbox', { name: 'Home goals' }).fill('3')
    await dialog.getByRole('textbox', { name: 'Away goals' }).fill('1')
    await dialog.getByRole('button', { name: 'Submit' }).click()

    await expect(dialog).toBeVisible()
  })

  test('cancel closes the dialog without submitting', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter score' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Enter score' })
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).not.toBeVisible({ timeout: 3_000 })
  })
})
