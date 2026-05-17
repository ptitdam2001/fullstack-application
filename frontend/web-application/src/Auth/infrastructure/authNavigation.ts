import { LOGIN_PAGE } from '../domain/Auth'

export const redirectToLogin = () => {
  window.location.replace(LOGIN_PAGE)
}
