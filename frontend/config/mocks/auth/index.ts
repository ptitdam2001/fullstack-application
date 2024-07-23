import { HttpResponse, delay, graphql } from 'msw'

export default [
  graphql.mutation('ResetPassword', () => {
    return HttpResponse.json({
      data: {
        redirection: '/reset-paswword/auth_token_123',
        status: 'email_sent',
      },
    })
  }),
  // Handles a "Login" mutation
  graphql.mutation('LoginUser', async req => {
    const { login } = req.variables.input

    await delay(2000)

    sessionStorage.setItem('is-authenticated', login)
    return HttpResponse.json({
      data: {
        login: {
          sessionId: 'abc-123',
        },
      },
    })
  }),

  graphql.query('Logout', () => {
    sessionStorage.removeItem('is-authenticated')
    return HttpResponse.json({
      data: {
        logout: true,
      },
    })
  }),
]
