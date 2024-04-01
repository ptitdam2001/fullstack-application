export const setAuth = (token: string) => {
  if (token) {
    localStorage.setItem('sessionId', token)
    return true
  }

  return false
}
