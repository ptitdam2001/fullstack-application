import { describe, expect, it } from 'vitest'
import { ACCOUNT_PAGE } from '@Auth/domain/Auth'
import { type UserWithoutPassword } from '@Sdk/model'
import { AppSidebarPage } from './AppSidebar.page'

// Profiles served by the generic menu (ConnectedAppSidebar): neither admin, coach nor player.
const GENERIC_MENU_PROFILES: Array<[profile: string, user: Partial<UserWithoutPassword>]> = [
  ['a user with no role', { roles: [] }],
  ['a referee', { isReferee: true, roles: ['REFEREE'] }],
]

describe('AppSidebar', () => {
  describe.each(GENERIC_MENU_PROFILES)('for %s', (_profile, user) => {
    it('shows the avatar and the full name in the footer', () => {
      const page = new AppSidebarPage(user).render()

      expect(page.footerAvatar()).toHaveTextContent('CM')
      expect(page.profileButton()).toHaveTextContent('Camille Martin')
    })

    it('shows the profile and sign-out entries in the footer, and nothing else', () => {
      const page = new AppSidebarPage(user).render()

      expect(page.signOutButton()).toBeInTheDocument()
      expect(page.footerButtons()).toHaveLength(2)
    })

    it('no longer shows the generic « Settings » and « My Profile » entries', () => {
      const page = new AppSidebarPage(user).render()

      expect(page.queryButton(/settings/i)).not.toBeInTheDocument()
      expect(page.queryButton(/my ?profile/i)).not.toBeInTheDocument()
    })

    it('opens the account page from the footer', () => {
      const page = new AppSidebarPage(user).render()

      page.clickProfileButton()

      expect(page.currentPath()).toBe(ACCOUNT_PAGE)
    })

    it.each([
      ['navigation.teams', '/app/team'],
      ['navigation.games', '/app/games'],
      ['navigation.calendar', '/app/calendar'],
    ])('labels the %s entry through i18n and navigates to %s', (labelId, url) => {
      const page = new AppSidebarPage(user).render()

      page.clickMenuButton(labelId)

      expect(page.currentPath()).toBe(url)
    })
  })
})
