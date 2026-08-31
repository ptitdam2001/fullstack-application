import { test, expect } from '@playwright/test'
import type { Match } from '@Sdk/model'
import { MatchStatus } from '@Sdk/model'

// MSW's generated mock randomizes `status` per match (see match.msw.ts), so a page load can
// land with zero SCHEDULED matches and no "Enter score" button. Route interception replaces
// the list with a fixed SCHEDULED match to make the score-entry flow deterministic.
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
    await page.route('**/matches?*', route => route.fulfill({ json: [scheduledMatch] }))
    await page.goto('/app/admin/matches')
  })

  test('enter score button opens the score entry dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter score' }).first().click()
    await expect(page.getByRole('dialog', { name: 'Enter score' })).toBeVisible({ timeout: 5_000 })
    await expect(page.getByRole('textbox', { name: 'Home goals' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Away goals' })).toBeVisible()
  })

  test('submitting a valid score closes the dialog', async ({ page }) => {
    await page.route(`**/match/${scheduledMatch.id}`, route =>
      route.fulfill({ json: { ...scheduledMatch, status: MatchStatus.PLAYED, homeGoals: 3, awayGoals: 1 } })
    )

    await page.getByRole('button', { name: 'Enter score' }).first().click()
    const dialog = page.getByRole('dialog', { name: 'Enter score' })
    await expect(dialog).toBeVisible({ timeout: 5_000 })

    await dialog.getByRole('textbox', { name: 'Home goals' }).fill('3')
    await dialog.getByRole('textbox', { name: 'Away goals' }).fill('1')
    await dialog.getByRole('button', { name: 'Submit' }).click()

    await expect(dialog).not.toBeVisible({ timeout: 5_000 })
  })

  test('API error keeps the dialog open and shows a notification', async ({ page }) => {
    await page.route(`**/match/${scheduledMatch.id}`, route =>
      route.fulfill({ status: 400, json: { err: [{ message: 'must be object' }] } })
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
