import { test, expect, type Page, type Request } from '@playwright/test'
import { applyMswOverride } from './mockMsw'
import { ACCOUNT_TOASTS, ACCOUNT_URL, AccountPage } from './pages/AccountPage'
import { corruptPhoto, JPEG_SIGNATURE, textFile, validPhoto } from './fixtures/images'

// These tests run with the storageState from setup/auth.setup.ts (admin user "Admin E2E").
// Oracle: specifications/24-page-compte.md.

const STORED_USER = {
  id: '000000000000000000000001',
  email: 'admin@e2e.local',
  firstName: 'Admin',
  lastName: 'E2E',
  isAdmin: true,
  isActive: true,
  isBlocked: false,
  isReferee: false,
}
const STORED_TOKEN = 'e2e-test-token'

const isApiCall = (method: string, path: string) => (request: Request) =>
  request.method() === method && new URL(request.url()).pathname === path

// Records every call to one API operation, to prove that a client-side refusal sent nothing.
const recordApiCalls = (page: Page, method: string, path: string) => {
  const calls: Request[] = []
  const matches = isApiCall(method, path)
  page.on('request', request => {
    if (matches(request)) {
      calls.push(request)
    }
  })
  return calls
}

test.describe('account — navigation', () => {
  test('opens from the sidebar footer and shows the three sections', async ({ page }) => {
    const account = new AccountPage(page)
    await page.goto('/app')

    await account.openFromSidebar('Admin E2E')

    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.heading).toBeVisible()
    await expect(account.photoSection).toBeVisible()
    await expect(account.profileSection).toBeVisible()
    await expect(account.passwordSection).toBeVisible()
  })

  test('email is displayed and cannot be edited', async ({ page }) => {
    const account = new AccountPage(page)
    await account.goto()

    await expect(account.email).toHaveText(STORED_USER.email)
    // No form control carries the email: neither an input holding it, nor an email field
    await expect(account.profileSection.locator('input[type="email"], input[name="email"]')).toHaveCount(0)
    await expect(account.profileSection.getByRole('textbox')).toHaveCount(2)
    expect(await account.email.evaluate(element => element.tagName)).toBe('DD')
    await expect(account.email).not.toHaveAttribute('contenteditable')
  })

  test('without a photo, the initials are shown as in the sidebar', async ({ page }) => {
    const account = new AccountPage(page)
    await account.goto()

    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
    await expect(account.avatar).toHaveText('AE')
    await expect(account.sidebarAvatar).toHaveText('AE')
    await expect(account.removePhotoButton).toHaveCount(0)
  })
})

test.describe('account — profile', () => {
  test.beforeEach(async ({ page }) => {
    await new AccountPage(page).goto()
  })

  test('form is pre-filled and Save is disabled while pristine', async ({ page }) => {
    const account = new AccountPage(page)

    await expect(account.firstNameInput).toHaveValue('Admin')
    await expect(account.lastNameInput).toHaveValue('E2E')
    await expect(account.saveButton).toBeDisabled()
  })

  test('editing the first name saves it and updates the sidebar footer', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'patch', '*/me', { ...STORED_USER, firstName: 'Camille' })

    await account.firstNameInput.fill('Camille')
    await expect(account.saveButton).toBeEnabled()
    const [request] = await Promise.all([page.waitForRequest(isApiCall('PATCH', '/me')), account.saveProfile()])

    expect(request.postDataJSON()).toEqual({ firstName: 'Camille', lastName: 'E2E' })
    await expect(page.getByText(ACCOUNT_TOASTS.profileUpdated)).toBeVisible()
    await expect(account.sidebarProfileButton('Camille E2E')).toBeVisible()
    await expect(account.sidebarAvatar).toHaveText('CE')
    // New baseline: pristine again
    await expect(account.firstNameInput).toHaveValue('Camille')
    await expect(account.saveButton).toBeDisabled()
  })

  test('the new name survives a reload (session storage is updated)', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'patch', '*/me', { ...STORED_USER, firstName: 'Camille' })

    await account.firstNameInput.fill('Camille')
    await account.saveProfile()
    await expect(page.getByText(ACCOUNT_TOASTS.profileUpdated)).toBeVisible()
    await page.reload()

    await expect(account.firstNameInput).toHaveValue('Camille')
    await expect(account.sidebarProfileButton('Camille E2E')).toBeVisible()
  })

  test('emptying the first name is refused with a field error', async ({ page }) => {
    const account = new AccountPage(page)
    const calls = recordApiCalls(page, 'PATCH', '/me')

    await account.firstNameInput.fill('')
    await account.firstNameInput.blur()

    await expect(account.saveButton).toBeDisabled()
    await expect(account.profileSection.getByText(/First name is required\.|Le prénom est obligatoire\./)).toBeVisible()
    expect(calls).toHaveLength(0)
  })

  test('a first name made of spaces only is refused', async ({ page }) => {
    const account = new AccountPage(page)

    await account.firstNameInput.fill('   ')
    await account.firstNameInput.blur()

    await expect(account.saveButton).toBeDisabled()
  })

  test('emptying the last name sends lastName: null and clears it', async ({ page }) => {
    const account = new AccountPage(page)
    const { lastName: _cleared, ...userWithoutLastName } = STORED_USER
    await applyMswOverride(page, 'patch', '*/me', userWithoutLastName)

    await account.lastNameInput.fill('')
    await expect(account.saveButton).toBeEnabled()
    const [request] = await Promise.all([page.waitForRequest(isApiCall('PATCH', '/me')), account.saveProfile()])

    expect(request.postDataJSON()).toEqual({ firstName: 'Admin', lastName: null })
    await expect(page.getByText(ACCOUNT_TOASTS.profileUpdated)).toBeVisible()
    await expect(account.lastNameInput).toHaveValue('')
    // Le nom accessible du bouton commence par les initiales de l'avatar (« A Admin ») : seule la fin est ancrée.
    await expect(account.sidebarProfileButton(/Admin\s*$/)).toBeVisible()
    await expect(account.sidebarAvatar).toHaveText('A')
  })

  test('a user without a last name can still change their first name', async ({ page }) => {
    const account = new AccountPage(page)
    const { lastName: _none, ...userWithoutLastName } = STORED_USER
    await page.addInitScript(session => localStorage.setItem('user', JSON.stringify(session)), {
      token: STORED_TOKEN,
      user: userWithoutLastName,
    })
    await page.reload()
    await applyMswOverride(page, 'patch', '*/me', { ...userWithoutLastName, firstName: 'Camille' })
    await expect(account.lastNameInput).toHaveValue('')

    await account.firstNameInput.fill('Camille')
    await expect(account.saveButton).toBeEnabled()
    const [request] = await Promise.all([page.waitForRequest(isApiCall('PATCH', '/me')), account.saveProfile()])

    expect(request.postDataJSON()).toEqual({ firstName: 'Camille', lastName: null })
    await expect(page.getByText(ACCOUNT_TOASTS.profileUpdated)).toBeVisible()
  })

  test('server error keeps the user on the page with their input', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'patch', '*/me', { status: 500, message: 'boom' }, 500)

    await account.firstNameInput.fill('Camille')
    await account.saveProfile()

    await expect(
      page.getByText(/Your profile could not be saved|Votre profil n'a pas pu être enregistré/)
    ).toBeVisible()
    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.firstNameInput).toHaveValue('Camille')
    await expect(account.sidebarProfileButton('Admin E2E')).toBeVisible()
  })
})

test.describe('account — password', () => {
  test.beforeEach(async ({ page }) => {
    await new AccountPage(page).goto()
  })

  test('mismatched confirmation shows a field error and sends no request', async ({ page }) => {
    const account = new AccountPage(page)
    const calls = recordApiCalls(page, 'PUT', '/me/password')

    await account.changePassword('Current1Password', 'NewPassword1', 'NewPassword2')

    await expect(account.confirmPasswordInput).toHaveAttribute('aria-invalid', 'true')
    await expect(
      account.passwordSection.getByText(/Passwords do not match\.|Les mots de passe ne correspondent pas\./)
    ).toBeVisible()
    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toHaveCount(0)
    expect(calls).toHaveLength(0)
  })

  for (const [rule, password] of [
    ['shorter than 8 characters', 'Short1A'],
    ['without a digit', 'NoDigitHere'],
    ['without an uppercase letter', 'nouppercase1'],
  ] as const) {
    test(`a new password ${rule} is refused client-side`, async ({ page }) => {
      const account = new AccountPage(page)
      const calls = recordApiCalls(page, 'PUT', '/me/password')

      await account.changePassword('Current1Password', password)

      await expect(account.newPasswordInput).toHaveAttribute('aria-invalid', 'true')
      await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toHaveCount(0)
      expect(calls).toHaveLength(0)
    })
  }

  test('current password is required', async ({ page }) => {
    const account = new AccountPage(page)
    const calls = recordApiCalls(page, 'PUT', '/me/password')

    await account.changePassword('', 'NewPassword1')

    await expect(account.currentPasswordInput).toHaveAttribute('aria-invalid', 'true')
    expect(calls).toHaveLength(0)
  })

  test('happy path — token is replaced, the confirmation is not sent, the user stays signed in', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/password', {
      userId: STORED_USER.id,
      email: STORED_USER.email,
      isAdmin: true,
      token: 'rotated-e2e-token',
    })
    expect(await account.storedToken()).toBe(STORED_TOKEN)

    await account.fillPasswords('Current1Password', 'NewPassword1')
    const [request] = await Promise.all([
      page.waitForRequest(isApiCall('PUT', '/me/password')),
      account.changePasswordButton.click(),
    ])

    // The confirmation is a UI-only field
    expect(request.postDataJSON()).toEqual({ currentPassword: 'Current1Password', newPassword: 'NewPassword1' })
    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toBeVisible()
    expect(await account.storedToken()).toBe('rotated-e2e-token')
    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.currentPasswordInput).toHaveValue('')
    await expect(account.newPasswordInput).toHaveValue('')
    await expect(account.confirmPasswordInput).toHaveValue('')

    // The very next API call carries the new token, and a navigation does not bounce to the login page
    const [nextCall] = await Promise.all([
      page.waitForRequest(candidate => candidate.headers()['authorization'] !== undefined),
      page.goto('/app/team/list'),
    ])
    expect(nextCall.headers()['authorization']).toBe('Bearer rotated-e2e-token')
    await expect(page).toHaveURL(/\/app\/team\/list/)
    await expect(page.getByTestId('TeamList')).toBeVisible()
    expect(await account.storedToken()).toBe('rotated-e2e-token')
  })

  test('server 400 (wrong current password) shows an error and does NOT sign the user out', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/password', { status: 400, message: 'Invalid password' }, 400)

    await account.changePassword('WrongPassword1', 'NewPassword1')

    await expect(account.passwordError).toBeVisible()
    await expect(account.passwordError).toHaveAttribute('data-error', 'invalid')
    await expect(page).toHaveURL(ACCOUNT_URL)
    expect(await account.storedToken()).toBe(STORED_TOKEN)
    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toHaveCount(0)
    // Still signed in after a reload
    await page.reload()
    await expect(page).toHaveURL(ACCOUNT_URL)
    await expect(account.heading).toBeVisible()
  })

  test('server 401 (account locked after too many wrong passwords) signs the user out', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/password', { status: 401, message: 'Unauthorized' }, 401)

    await account.changePassword('WrongPassword1', 'NewPassword1')

    await expect(page).toHaveURL(/\/auth\/signin/)
    // The stored session is emptied: no token is left for the next request
    expect(await account.storedToken()).toBeFalsy()
  })

  test('server 429 invites the user to retry later', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/password', { status: 429, message: 'Too many requests' }, 429)

    await account.changePassword('Current1Password', 'NewPassword1')

    await expect(account.passwordError).toBeVisible()
    await expect(account.passwordError).toHaveAttribute('data-error', 'tooManyRequests')
    await expect(page).toHaveURL(ACCOUNT_URL)
    expect(await account.storedToken()).toBe(STORED_TOKEN)
  })

  test('the server error disappears once a later attempt succeeds', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/password', { status: 400, message: 'Invalid password' }, 400)
    await account.changePassword('WrongPassword1', 'NewPassword1')
    await expect(account.passwordError).toHaveAttribute('data-error', 'invalid')

    await applyMswOverride(page, 'put', '*/me/password', {
      userId: STORED_USER.id,
      email: STORED_USER.email,
      isAdmin: true,
      token: 'rotated-e2e-token',
    })
    await account.changePassword('Current1Password', 'NewPassword1')

    await expect(page.getByText(ACCOUNT_TOASTS.passwordChanged)).toBeVisible()
    await expect(account.passwordError).toHaveCount(0)
  })
})

test.describe('account — photo', () => {
  test.beforeEach(async ({ page }) => {
    await new AccountPage(page).goto()
  })

  test('choosing a valid image uploads a base64 JPEG and shows the success toast', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/avatar', { ...STORED_USER, avatar: '/images/aaaaaaaaaaaaaaaaaaaaaaaa' })

    const [request] = await Promise.all([
      page.waitForRequest(isApiCall('PUT', '/me/avatar')),
      account.choosePhoto(validPhoto()),
    ])

    const body = request.postDataJSON() as { contentType: string; data: string }
    expect(Object.keys(body).sort()).toEqual(['contentType', 'data'])
    expect(body.contentType).toBe('image/jpeg')
    expect(body.data).not.toMatch(/^data:/)
    expect(body.data).toMatch(/^[A-Za-z0-9+/]+={0,2}$/)
    // The bytes really are a JPEG (the source file was a PNG: it is re-encoded in the browser)
    expect(Buffer.from(body.data, 'base64').subarray(0, 3)).toEqual(JPEG_SIGNATURE.subarray(0, 3))

    await expect(page.getByText(ACCOUNT_TOASTS.photoUpdated)).toBeVisible()
    await expect(account.avatar).toHaveAttribute('data-has-image', 'true')
    await expect(account.sidebarAvatar).toHaveAttribute('data-has-image', 'true')
    await expect(account.removePhotoButton).toBeVisible()
    await expect(account.photoError).toHaveCount(0)
  })

  test('choosing a non-image file is refused and sends nothing', async ({ page }) => {
    const account = new AccountPage(page)
    const calls = recordApiCalls(page, 'PUT', '/me/avatar')

    await account.choosePhoto(textFile())

    await expect(account.photoError).toBeVisible()
    await expect(account.photoError).toHaveAttribute('data-error', 'invalidType')
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
    expect(calls).toHaveLength(0)
  })

  test('choosing an undecodable image is refused and sends nothing', async ({ page }) => {
    const account = new AccountPage(page)
    const calls = recordApiCalls(page, 'PUT', '/me/avatar')

    await account.choosePhoto(corruptPhoto())

    await expect(account.photoError).toBeVisible()
    await expect(account.photoError).toHaveAttribute('data-error', 'unreadable')
    expect(calls).toHaveLength(0)
  })

  test('server 400 shows the "rejected" error and keeps the previous state', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/avatar', { status: 400, message: 'The image exceeds 100 kB' }, 400)

    await account.choosePhoto(validPhoto())

    await expect(account.photoError).toBeVisible()
    await expect(account.photoError).toHaveAttribute('data-error', 'rejected')
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
    await expect(page.getByText(ACCOUNT_TOASTS.photoUpdated)).toHaveCount(0)
    await expect(page).toHaveURL(ACCOUNT_URL)
  })

  test('the error disappears when a later upload succeeds', async ({ page }) => {
    const account = new AccountPage(page)
    await account.choosePhoto(textFile())
    await expect(account.photoError).toHaveAttribute('data-error', 'invalidType')

    await applyMswOverride(page, 'put', '*/me/avatar', { ...STORED_USER, avatar: '/images/aaaaaaaaaaaaaaaaaaaaaaaa' })
    await account.choosePhoto(validPhoto())

    await expect(page.getByText(ACCOUNT_TOASTS.photoUpdated)).toBeVisible()
    await expect(account.photoError).toHaveCount(0)
  })

  test('removing the photo brings the initials back', async ({ page }) => {
    const account = new AccountPage(page)
    await applyMswOverride(page, 'put', '*/me/avatar', { ...STORED_USER, avatar: '/images/aaaaaaaaaaaaaaaaaaaaaaaa' })
    await account.choosePhoto(validPhoto())
    await expect(account.avatar).toHaveAttribute('data-has-image', 'true')

    await applyMswOverride(page, 'delete', '*/me/avatar', STORED_USER)
    const [request] = await Promise.all([page.waitForRequest(isApiCall('DELETE', '/me/avatar')), account.removePhoto()])

    expect(request.postData()).toBeNull()
    await expect(page.getByText(ACCOUNT_TOASTS.photoRemoved)).toBeVisible()
    await expect(account.avatar).toHaveAttribute('data-has-image', 'false')
    await expect(account.avatar).toHaveText('AE')
    await expect(account.sidebarAvatar).toHaveAttribute('data-has-image', 'false')
    await expect(account.removePhotoButton).toHaveCount(0)
  })
})
