import { test, expect, request as playwrightRequest, type APIRequestContext, type Page } from '@playwright/test'
import { ACCOUNT_TOASTS, ACCOUNT_URL, AccountPage } from '../pages/AccountPage'
import { createPng, JPEG_SIGNATURE, PNG_SIGNATURE, type FilePayload } from '../fixtures/images'

// Oracle: specifications/24-page-compte.md + backend/openapi.yml.
//
// The other smoke specs share the seed ADMIN and its stored session. Changing a password revokes every
// token of the user, so this spec never touches the admin: it signs in by itself with the seed COACH
// (whose sidebar footer shows the avatar and the full name), runs serially, and puts the account back in
// its seed state before and after.

const API_URL = process.env.SMOKE_API_URL ?? 'http://localhost:4001'

const SEED = { email: 'coach@seed.local', password: 'Seed@1234', firstName: 'Coach', lastName: 'Seed' }
// Seed user without any role: gets the generic sidebar (ConnectedAppSidebar)
const NO_ROLE_USER = { email: 'user@seed.local', password: 'Seed@1234', fullName: 'User Seed' }
const SEED_FULL_NAME = `${SEED.firstName} ${SEED.lastName}`
const NEW_PASSWORD = 'Smoke@5678'
const MAX_AVATAR_BYTES = 100 * 1024

test.describe.configure({ mode: 'serial' })
test.use({ storageState: { cookies: [], origins: [] } })

type Me = {
  id: string
  firstName?: string
  lastName?: string | null
  email: string
  isAdmin: boolean
  avatar?: string | null
}

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` })

const apiLogin = async (api: APIRequestContext, password: string) =>
  api.post(`${API_URL}/login`, { data: { email: SEED.email, password } })

const apiToken = async (api: APIRequestContext, password: string = SEED.password): Promise<string> => {
  const response = await apiLogin(api, password)
  expect(response.status(), `login as ${SEED.email}`).toBe(200)
  return ((await response.json()) as { token: string }).token
}

const apiMe = async (api: APIRequestContext, token: string): Promise<Me> => {
  const response = await api.get(`${API_URL}/me`, { headers: bearer(token) })
  expect(response.status()).toBe(200)
  return (await response.json()) as Me
}

const putAvatar = (api: APIRequestContext, token: string, contentType: string, bytes: Buffer | string) =>
  api.put(`${API_URL}/me/avatar`, {
    headers: bearer(token),
    data: { contentType, data: typeof bytes === 'string' ? bytes : bytes.toString('base64') },
  })

// Puts the dedicated user back in its seed state, whatever a previous (possibly failed) run left behind.
const restoreSeedUser = async () => {
  const api = await playwrightRequest.newContext()
  try {
    let token: string | undefined
    for (const password of [SEED.password, NEW_PASSWORD]) {
      const response = await apiLogin(api, password)
      if (!response.ok()) {
        continue
      }
      token = ((await response.json()) as { token: string }).token
      if (password !== SEED.password) {
        const changed = await api.put(`${API_URL}/me/password`, {
          headers: bearer(token),
          data: { currentPassword: password, newPassword: SEED.password },
        })
        expect(changed.status(), 'restore the seed password').toBe(200)
        token = ((await changed.json()) as { token: string }).token
      }
      break
    }
    expect(token, `${SEED.email} can sign in with a known password`).toBeTruthy()
    const headers = bearer(token!)
    await api.patch(`${API_URL}/me`, { headers, data: { firstName: SEED.firstName, lastName: SEED.lastName } })
    await api.delete(`${API_URL}/me/avatar`, { headers })
  } finally {
    await api.dispose()
  }
}

const signIn = async (page: Page, password: string = SEED.password, email: string = SEED.email) => {
  await page.goto('/auth/signin')
  await page.getByTestId('signin-form').waitFor({ timeout: 15_000 })
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(password)
  await page.getByTestId('signin-submit').click()
  await expect(page).toHaveURL(/\/app/, { timeout: 15_000 })
}

const openAccount = async (page: Page, password?: string) => {
  await signIn(page, password)
  const account = new AccountPage(page)
  await account.goto()
  await expect(account.heading).toBeVisible({ timeout: 15_000 })
  return account
}

const photo = (name: string, width: number, height: number, color: [number, number, number]): FilePayload => ({
  name,
  mimeType: 'image/png',
  buffer: createPng(width, height, () => [...color, 255]),
})

const naturalSize = (image: HTMLImageElement) => ({ width: image.naturalWidth, height: image.naturalHeight })

test.beforeAll(restoreSeedUser)
test.afterAll(restoreSeedUser)

test.describe('smoke — account page', () => {
  test('opens from the sidebar footer', async ({ page }) => {
    await signIn(page)
    const account = new AccountPage(page)

    await account.openFromSidebar(SEED_FULL_NAME)

    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.heading).toBeVisible()
    await expect(account.photoSection).toBeVisible()
    await expect(account.profileSection).toBeVisible()
    await expect(account.passwordSection).toBeVisible()
    await expect(account.email).toHaveText(SEED.email)
    await expect(account.firstNameInput).toHaveValue(SEED.firstName)
    await expect(account.lastNameInput).toHaveValue(SEED.lastName)
    await expect(account.avatar).toHaveText('CS')
  })

  test('a user without any role reaches the page from the sidebar footer too', async ({ page }) => {
    await signIn(page, NO_ROLE_USER.password, NO_ROLE_USER.email)
    const account = new AccountPage(page)

    // Generic sidebar: the entry is a plain « My Profile » button, not the user's name
    await page
      .locator('[data-slot="sidebar-footer"]')
      .getByRole('button', { name: /my profile|mon profil/i })
      .click()

    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.heading).toBeVisible()
    await expect(account.email).toHaveText(NO_ROLE_USER.email)
    await expect(account.avatar).toHaveText('US')
  })

  // BUG (spec 24 « Section Photo » 1 et 4, « Section Profil » 4 : photo/initiales et identité dans le menu
  // latéral, « quel que soit le profil ») : les profils Arbitre et Sans équipe ont le menu générique
  // (ConnectedAppSidebar), sans avatar ni nom — la photo n'y apparaît jamais.
  // Suivi : https://github.com/ptitdam2001/fullstack-application/issues/50
  test.fixme('a user without any role sees their avatar and name in the sidebar footer', async ({ page }) => {
    await signIn(page, NO_ROLE_USER.password, NO_ROLE_USER.email)
    const account = new AccountPage(page)

    await expect(account.sidebarProfileButton(NO_ROLE_USER.fullName)).toBeVisible()
    await expect(account.sidebarAvatar).toHaveText('US')
  })

  test('profile edit is persisted (survives a reload and is returned by GET /me)', async ({ page, request }) => {
    const account = await openAccount(page)
    const firstName = `Smoke${Date.now()}`

    await account.firstNameInput.fill(firstName)
    await account.saveProfile()

    await expect(page.getByText(ACCOUNT_TOASTS.profileUpdated)).toBeVisible()
    await expect(account.sidebarProfileButton(`${firstName} ${SEED.lastName}`)).toBeVisible()

    await page.reload()
    await expect(account.firstNameInput).toHaveValue(firstName)
    await expect(account.sidebarProfileButton(`${firstName} ${SEED.lastName}`)).toBeVisible()
    const me = await apiMe(request, (await account.storedToken())!)
    expect(me.firstName).toBe(firstName)
    expect(me.lastName).toBe(SEED.lastName)
    expect(me.email).toBe(SEED.email)

    // Restore through the UI
    await account.firstNameInput.fill(SEED.firstName)
    await account.saveProfile()
    await expect(account.sidebarProfileButton(SEED_FULL_NAME)).toBeVisible()
    expect((await apiMe(request, (await account.storedToken())!)).firstName).toBe(SEED.firstName)
  })

  test('avatar round trip — upload, public image, replace, remove', async ({ page, request }) => {
    const account = await openAccount(page)
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')

    // ── Upload a non-square picture: cropped to a 256 × 256 square
    await account.choosePhoto(photo('landscape.png', 600, 400, [200, 40, 40]))
    await expect(page.getByText(ACCOUNT_TOASTS.photoUpdated)).toBeVisible()
    await expect(account.photo).toBeVisible()
    await expect.poll(() => account.photo.evaluate(naturalSize)).toEqual({ width: 256, height: 256 })

    const firstUrl = (await account.photo.getAttribute('src'))!
    expect(firstUrl).toMatch(new RegExp(`^${API_URL}/images/[A-Za-z0-9_-]{22}$`))

    // The sidebar picture is refreshed without a reload, and really loads
    const sidebarImage = account.sidebarAvatar.locator('img')
    await expect(sidebarImage).toHaveAttribute('src', firstUrl)
    await expect.poll(() => sidebarImage.evaluate(naturalSize)).toEqual({ width: 256, height: 256 })

    // ── The image is public: no Authorization header
    const anonymous = await request.get(firstUrl)
    expect(anonymous.status()).toBe(200)
    expect(anonymous.headers()['content-type']).toBe('image/jpeg')
    expect(anonymous.headers()['x-content-type-options']).toBe('nosniff')
    expect(anonymous.headers()['cache-control']).toMatch(/public/)
    expect(anonymous.headers()['cache-control']).toMatch(/max-age=[1-9]\d*/)
    const bytes = await anonymous.body()
    expect(bytes.subarray(0, 3)).toEqual(JPEG_SIGNATURE.subarray(0, 3))
    expect(bytes.length).toBeLessThanOrEqual(MAX_AVATAR_BYTES)

    const token = (await account.storedToken())!
    expect((await apiMe(request, token)).avatar).toBe(new URL(firstUrl).pathname)

    // ── Persisted: still there after a reload
    await page.reload()
    await expect(account.photo).toHaveAttribute('src', firstUrl)
    await expect.poll(() => account.photo.evaluate(naturalSize)).toEqual({ width: 256, height: 256 })

    // ── Replace: new URL, the previous image is gone
    await account.choosePhoto(photo('portrait.png', 300, 500, [40, 160, 60]))
    await expect(account.photo).not.toHaveAttribute('src', firstUrl)
    const secondUrl = (await account.photo.getAttribute('src'))!
    await expect.poll(() => account.photo.evaluate(naturalSize)).toEqual({ width: 256, height: 256 })
    await expect(sidebarImage).toHaveAttribute('src', secondUrl)
    expect((await request.get(firstUrl)).status()).toBe(404)
    expect((await request.get(secondUrl)).status()).toBe(200)

    // ── Remove: initials are back, the image is gone
    await account.removePhoto()
    await expect(page.getByText(ACCOUNT_TOASTS.photoRemoved)).toBeVisible()
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
    await expect(account.avatar).toHaveText('CS')
    await expect(account.sidebarAvatar).toHaveAttribute('data-has-image', 'false')
    await expect(account.sidebarAvatar).toHaveText('CS')
    await expect(account.removePhotoButton).toHaveCount(0)
    expect((await request.get(secondUrl)).status()).toBe(404)
    expect((await apiMe(request, token)).avatar ?? null).toBeNull()

    await page.reload()
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
  })

  test('wrong current password — error shown, user NOT signed out, password unchanged', async ({ page, request }) => {
    const account = await openAccount(page)
    const tokenBefore = await account.storedToken()

    await account.changePassword('Wrong@0000', NEW_PASSWORD)

    await expect(account.passwordError).toBeVisible()
    await expect(account.passwordError).toHaveAttribute('data-error', 'invalid')
    await expect(page).toHaveURL(ACCOUNT_URL)
    expect(await account.storedToken()).toBe(tokenBefore)

    // Still signed in: the session survives a reload and the token is still accepted
    await page.reload()
    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.heading).toBeVisible()
    expect((await request.get(`${API_URL}/me`, { headers: bearer(tokenBefore!) })).status()).toBe(200)

    // Nothing changed server-side
    expect((await apiLogin(request, SEED.password)).status()).toBe(200)
    expect((await apiLogin(request, NEW_PASSWORD)).ok()).toBe(false)
  })

  test('password change — token rotation, old sessions revoked, old password refused', async ({
    page,
    request,
    browser,
  }) => {
    // A second device, signed in before the change
    const otherDevice = await browser.newContext({ storageState: { cookies: [], origins: [] } })
    const otherPage = await otherDevice.newPage()
    await openAccount(otherPage)

    const account = await openAccount(page)
    const oldToken = (await account.storedToken())!
    expect((await request.get(`${API_URL}/me`, { headers: bearer(oldToken) })).status()).toBe(200)

    // A JWT is deterministic and its `iat` has whole-second precision: a password changed in the very second
    // of the sign-in would yield the same token again, still valid. Never the case for a human — only for a test.
    await page.waitForTimeout(1_100)
    await account.changePassword(SEED.password, NEW_PASSWORD)

    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toBeVisible()
    await expect(page).toHaveURL(ACCOUNT_URL)
    const newToken = (await account.storedToken())!
    expect(newToken).toBeTruthy()
    expect(newToken).not.toBe(oldToken)

    // The current device stays signed in: the new token is accepted, navigation does not bounce
    expect((await request.get(`${API_URL}/me`, { headers: bearer(newToken) })).status()).toBe(200)
    await page.goto('/app/team/list')
    await expect(page.getByTestId('TeamList')).toBeVisible({ timeout: 15_000 })
    await expect(page).toHaveURL(/\/app\/team\/list/)
    await account.goto()
    await expect(account.heading).toBeVisible()
    expect(await account.storedToken()).toBe(newToken)

    // `tokensValidAfter` is compared to the JWT `iat` per whole second
    await page.waitForTimeout(1_100)
    expect((await request.get(`${API_URL}/me`, { headers: bearer(oldToken) })).status()).toBe(401)

    // The other device is sent back to the login page at its next action (a background refetch may
    // already have done it: reloading is an action that works in both cases)
    await otherPage.reload()
    await expect(otherPage).toHaveURL(/\/auth\/signin/, { timeout: 15_000 })
    await otherPage.goto('/app/my-profile')
    await expect(otherPage).toHaveURL(/\/auth\/signin/, { timeout: 15_000 })
    await otherDevice.close()

    // Old password refused, new one accepted — through the API and through the login form
    const oldLogin = await apiLogin(request, SEED.password)
    expect(oldLogin.ok()).toBe(false)
    expect(((await oldLogin.json()) as { token?: string }).token).toBeUndefined()
    expect((await apiLogin(request, NEW_PASSWORD)).status()).toBe(200)

    // Restore the seed password through the UI: the rotated session can change it again
    await account.changePassword(NEW_PASSWORD, SEED.password)
    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toBeVisible()
    expect((await apiLogin(request, SEED.password)).status()).toBe(200)
    expect((await apiLogin(request, NEW_PASSWORD)).ok()).toBe(false)
  })
})

test.describe('smoke — account API hardening', () => {
  let token: string

  test.beforeEach(async ({ request }) => {
    token = await apiToken(request)
  })

  test('every /me route answers 401 without a token', async ({ request }) => {
    const calls = [
      request.get(`${API_URL}/me`),
      request.patch(`${API_URL}/me`, { data: { firstName: 'Anonymous' } }),
      request.put(`${API_URL}/me/avatar`, {
        data: { contentType: 'image/png', data: PNG_SIGNATURE.toString('base64') },
      }),
      request.delete(`${API_URL}/me/avatar`),
      request.put(`${API_URL}/me/password`, { data: { currentPassword: SEED.password, newPassword: NEW_PASSWORD } }),
    ]

    for (const response of await Promise.all(calls)) {
      expect(response.status(), response.url()).toBe(401)
    }
    const invalid = await request.patch(`${API_URL}/me`, { headers: bearer('not-a-jwt'), data: { firstName: 'X' } })
    expect(invalid.status()).toBe(401)
    expect((await apiLogin(request, SEED.password)).status()).toBe(200)
  })

  test('PATCH /me refuses any field outside firstName / lastName', async ({ request }) => {
    for (const body of [
      { isAdmin: true },
      { firstName: 'Hacker', isAdmin: true },
      { email: 'x@y.z' },
      { isReferee: true },
      { isActive: false },
      { isBlocked: true },
      { avatar: 'https://evil.example/pic.png' },
      { password: 'Hacked@1234' },
      { id: '000000000000000000000001' },
    ]) {
      const response = await request.patch(`${API_URL}/me`, { headers: bearer(token), data: body })
      expect(response.status(), JSON.stringify(body)).toBe(400)
    }

    const me = await apiMe(request, token)
    expect(me.isAdmin).toBe(false)
    expect(me.email).toBe(SEED.email)
    expect(me.firstName).toBe(SEED.firstName)
    expect(me.avatar ?? null).toBeNull()
    // Privileges are unchanged in a fresh session too
    expect(((await (await apiLogin(request, SEED.password)).json()) as { isAdmin: boolean }).isAdmin).toBe(false)
    const adminOnly = await request.get(`${API_URL}/users`, { headers: bearer(token) })
    expect(adminOnly.ok()).toBe(false)
  })

  test('PATCH /me — first name cannot be emptied, last name can be cleared with null', async ({ request }) => {
    const headers = bearer(token)

    expect((await request.patch(`${API_URL}/me`, { headers, data: { firstName: '' } })).status()).toBe(400)
    expect((await request.patch(`${API_URL}/me`, { headers, data: { firstName: null } })).status()).toBe(400)
    expect((await apiMe(request, token)).firstName).toBe(SEED.firstName)

    const cleared = await request.patch(`${API_URL}/me`, { headers, data: { lastName: null } })
    expect(cleared.status()).toBe(200)
    expect(((await cleared.json()) as Me).lastName ?? null).toBeNull()
    const me = await apiMe(request, token)
    expect(me.lastName ?? null).toBeNull()
    expect(me.firstName).toBe(SEED.firstName)

    // No field at all: nothing changes
    expect((await request.patch(`${API_URL}/me`, { headers, data: {} })).status()).toBe(200)
    expect((await apiMe(request, token)).firstName).toBe(SEED.firstName)

    const restored = await request.patch(`${API_URL}/me`, { headers, data: { lastName: SEED.lastName } })
    expect(restored.status()).toBe(200)
    expect(((await restored.json()) as Me).lastName).toBe(SEED.lastName)
  })

  test('PATCH /me refuses a first name made of spaces only', async ({ request }) => {
    const response = await request.patch(`${API_URL}/me`, { headers: bearer(token), data: { firstName: '   ' } })

    expect(response.status()).toBe(400)
    expect((await apiMe(request, token)).firstName).toBe(SEED.firstName)
  })

  test('the UserWithoutPassword responses never leak the password hash', async ({ request }) => {
    const headers = bearer(token)
    const responses = [
      await request.patch(`${API_URL}/me`, { headers, data: { firstName: SEED.firstName } }),
      await request.delete(`${API_URL}/me/avatar`, { headers }),
      await request.get(`${API_URL}/me`, { headers }),
    ]

    for (const response of responses) {
      expect(response.status()).toBe(200)
      const body = (await response.json()) as Record<string, unknown>
      expect(Object.keys(body)).not.toContain('password')
      expect(JSON.stringify(body)).not.toMatch(/\$2[aby]\$/)
    }
  })

  test('PUT /me/avatar refuses what is not a JPEG, PNG or WebP of at most 100 kB', async ({ request }) => {
    const realPng = createPng(8, 8, () => [10, 20, 30, 255])
    const overLimit = Buffer.concat([JPEG_SIGNATURE, Buffer.alloc(MAX_AVATAR_BYTES + 1 - JPEG_SIGNATURE.length, 0x41)])
    const huge = Buffer.concat([JPEG_SIGNATURE, Buffer.alloc(3 * 1024 * 1024, 0x41)])

    const cases: Array<[label: string, contentType: string, data: Buffer | string]> = [
      ['PNG bytes announced as JPEG', 'image/jpeg', realPng],
      ['JPEG signature announced as PNG', 'image/png', Buffer.concat([JPEG_SIGNATURE, Buffer.alloc(64)])],
      ['text file', 'image/jpeg', Buffer.from('just some text, definitely not a picture')],
      ['HTML announced as PNG', 'image/png', Buffer.from('<html><script>alert(1)</script></html>')],
      ['SVG announced as WebP', 'image/webp', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')],
      ['one byte over 100 kB', 'image/jpeg', overLimit],
      ['3 MB', 'image/jpeg', huge],
      ['data: URL prefix', 'image/png', `data:image/png;base64,${realPng.toString('base64')}`],
      ['not base64', 'image/png', '***not base64***'],
      ['unsupported content type', 'image/gif', Buffer.from('GIF89a')],
      ['SVG content type', 'image/svg+xml', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')],
      ['empty data', 'image/png', ''],
    ]

    for (const [label, contentType, data] of cases) {
      const response = await putAvatar(request, token, contentType, data)
      expect(response.status(), label).toBe(400)
    }
    expect((await apiMe(request, token)).avatar ?? null).toBeNull()

    // Extra fields are refused too
    const extra = await request.put(`${API_URL}/me/avatar`, {
      headers: bearer(token),
      data: { contentType: 'image/png', data: realPng.toString('base64'), ownerId: '000000000000000000000001' },
    })
    expect(extra.status()).toBe(400)
  })

  test('PUT /me/avatar — a picture of exactly 100 kB is accepted, a refused one keeps the previous photo', async ({
    request,
  }) => {
    const atLimit = Buffer.concat([JPEG_SIGNATURE, Buffer.alloc(MAX_AVATAR_BYTES - JPEG_SIGNATURE.length, 0x41)])

    const accepted = await putAvatar(request, token, 'image/jpeg', atLimit)
    expect(accepted.status()).toBe(200)
    const avatar = ((await accepted.json()) as Me).avatar!
    expect(avatar).toMatch(/^\/images\/[A-Za-z0-9_-]{22}$/)
    const served = await request.get(`${API_URL}${avatar}`)
    expect(served.status()).toBe(200)
    expect((await served.body()).length).toBe(MAX_AVATAR_BYTES)

    // A PNG keeps its own content type
    const png = createPng(8, 8, () => [10, 20, 30, 255])
    const pngAccepted = await putAvatar(request, token, 'image/png', png)
    expect(pngAccepted.status()).toBe(200)
    const pngAvatar = ((await pngAccepted.json()) as Me).avatar!
    const pngServed = await request.get(`${API_URL}${pngAvatar}`)
    expect(pngServed.headers()['content-type']).toBe('image/png')
    expect(pngServed.headers()['x-content-type-options']).toBe('nosniff')
    expect(await pngServed.body()).toEqual(png)
    expect((await request.get(`${API_URL}${avatar}`)).status()).toBe(404)

    // Spec: « la photo précédente est conservée » when the new one is refused
    const refused = await putAvatar(request, token, 'image/jpeg', Buffer.from('not a picture'))
    expect(refused.status()).toBe(400)
    expect((await apiMe(request, token)).avatar).toBe(pngAvatar)
    expect((await request.get(`${API_URL}${pngAvatar}`)).status()).toBe(200)

    // Removing twice: idempotent
    const headers = bearer(token)
    expect((await request.delete(`${API_URL}/me/avatar`, { headers })).status()).toBe(200)
    const again = await request.delete(`${API_URL}/me/avatar`, { headers })
    expect(again.status()).toBe(200)
    expect(((await again.json()) as Me).avatar ?? null).toBeNull()
    expect((await request.get(`${API_URL}${pngAvatar}`)).status()).toBe(404)
  })

  test('GET /images/{id} answers 404 for unknown or malformed ids', async ({ request }) => {
    for (const id of [
      'not-an-id',
      'aaaaaaaaaaaaaaaaaaaaaaaa',
      'aaaaaaaaaaaaaaaaaaaaaa',
      '123',
      '%00',
      '..%2F..%2Fme',
      'zzzzzzzzzzzzzzzzzzzzzzzz',
    ]) {
      const response = await request.get(`${API_URL}/images/${id}`)
      expect(response.status(), id).toBe(404)
    }
  })

  test('PUT /me/password — wrong current password and weak new passwords answer 400, never 401', async ({
    request,
  }) => {
    const headers = bearer(token)
    const cases: Array<[label: string, body: Record<string, unknown>]> = [
      ['wrong current password', { currentPassword: 'Wrong@0000', newPassword: NEW_PASSWORD }],
      ['new password too short', { currentPassword: SEED.password, newPassword: 'Ab1' }],
      ['new password without a digit', { currentPassword: SEED.password, newPassword: 'NoDigitHere' }],
      ['new password without an uppercase letter', { currentPassword: SEED.password, newPassword: 'nouppercase1' }],
      ['missing current password', { newPassword: NEW_PASSWORD }],
      ['empty current password', { currentPassword: '', newPassword: NEW_PASSWORD }],
      [
        'confirmation sent to the API',
        { currentPassword: SEED.password, newPassword: NEW_PASSWORD, confirmPassword: NEW_PASSWORD },
      ],
    ]

    for (const [label, data] of cases) {
      const response = await request.put(`${API_URL}/me/password`, { headers, data })
      expect(response.status(), label).toBe(400)
      expect(JSON.stringify(await response.json()), label).not.toContain('token')
    }

    // Nothing changed: same password, and the token used for the attempts is still valid
    expect((await request.get(`${API_URL}/me`, { headers })).status()).toBe(200)
    expect((await apiLogin(request, SEED.password)).status()).toBe(200)
    expect((await apiLogin(request, NEW_PASSWORD)).ok()).toBe(false)
  })
})
