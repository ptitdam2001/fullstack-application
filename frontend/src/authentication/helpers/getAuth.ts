// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getAuth = ({ authState }: any): string | null => {
  if (!authState) {
    const sessionId = localStorage.getItem('sessionId')
    // const refreshToken = localStorage.getItem('refreshToken');
    if (sessionId) {
      return sessionId
    }
    return null
  }

  return null
}
