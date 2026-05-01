import { navigateTo } from '@Common/navigation'

export const redirectToLogin = (): void => {
  navigateTo('/auth/signin', { replace: true })
}
