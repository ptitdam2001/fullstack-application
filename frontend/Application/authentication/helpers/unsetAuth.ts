export const unsetAuth = () => {
  localStorage.removeItem('sessionId')
  return true
}
